'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireProfile, requireMasterAdmin } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

/**
 * Verificar acceso a un proyecto
 */
async function verifyProjectAccess(projectId: string) {
    const { profile } = await requireProfile()
    const supabase = createClient()

    // Master admin tiene acceso a todo
    if (profile.role === 'master_admin') {
        const { data: project } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single()
        return { hasAccess: !!project, project, profile }
    }

    // Verificar si es de su organización
    const { data: orgProject } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('organization_id', profile.organization_id)
        .single()

    if (orgProject) {
        return { hasAccess: true, project: orgProject, profile }
    }

    // Verificar si es miembro del proyecto
    const { data: membership } = await supabase
        .from('project_members')
        .select('*, projects(*)')
        .eq('project_id', projectId)
        .eq('user_id', profile.id)
        .single()

    if (membership) {
        return { hasAccess: true, project: membership.projects, profile, membership }
    }

    return { hasAccess: false, project: null, profile }
}

/**
 * Obtener dashboard del proyecto
 */
export async function getProjectDashboard(projectId: string) {
    const access = await verifyProjectAccess(projectId)

    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()

    // Obtener estadísticas
    const [propertiesCount, logsCount, ticketsCount, updatesCount, agenciesData] = await Promise.all([
        supabase.from('scraper_properties').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
        supabase.from('scraper_logs').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
        supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
        supabase.from('project_updates').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
        supabase.from('scraper_properties').select('agency, phone, portal, price, created_at').eq('project_id', projectId),
    ])

    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

    const agencyData = new Map<string, { name: string; count: number; phoneCounts: Map<string, number> }>()
    ;(agenciesData.data || [])
        .filter((p) => p.agency?.trim())
        .forEach((p) => {
            const raw = p.agency!.trim()
            const key = normAccent(raw)
            const phone = p.phone?.trim() || ''
            const existing = agencyData.get(key)
            if (existing) {
                existing.count++
                if (phone) {
                    const c = existing.phoneCounts.get(phone) || 0
                    existing.phoneCounts.set(phone, c + 1)
                }
            } else {
                const phoneCounts = new Map<string, number>()
                if (phone) phoneCounts.set(phone, 1)
                agencyData.set(key, { name: raw, count: 1, phoneCounts })
            }
        })

    const allAgencies = Array.from(agencyData.values())
        .map((a) => {
            let topPhone = ''
            let maxCount = 0
            a.phoneCounts.forEach((c, p) => {
                if (c > maxCount) {
                    maxCount = c
                    topPhone = p
                }
            })
            return { name: a.name, count: a.count, phone: topPhone }
        })
        .sort((a, b) => b.count - a.count)
    const topAgencies = allAgencies.slice(0, 5)

    // --- Platform stats ---
    const allProps = agenciesData.data || []
    const platformMap = new Map<string, { total: number; agencies: Set<string>; totalPrice: number; priceCount: number }>()
    allProps.forEach((p: any) => {
        const portal = p.portal || 'Desconocido'
        const agencyKey = normAccent(p.agency || '')
        const price = Number(p.price) || 0
        const existing = platformMap.get(portal)
        if (existing) {
            existing.total++
            if (agencyKey) existing.agencies.add(agencyKey)
            if (price > 0) { existing.totalPrice += price; existing.priceCount++ }
        } else {
            const agencies = new Set<string>()
            if (agencyKey) agencies.add(agencyKey)
            platformMap.set(portal, {
                total: 1,
                agencies,
                totalPrice: price > 0 ? price : 0,
                priceCount: price > 0 ? 1 : 0
            })
        }
    })
    const platformStats = Array.from(platformMap.entries())
        .map(([portal, data]) => ({
            portal,
            total: data.total,
            agencies: data.agencies.size,
            avgPrice: data.priceCount > 0 ? Math.round(data.totalPrice / data.priceCount) : 0
        }))
        .sort((a, b) => b.total - a.total)

    // --- New agencies (first seen in last 3 days) ---
    const agencyFirstSeenMap = new Map<string, { name: string; portal: string; firstSeen: string; count: number }>()
    allProps.filter((p: any) => p.agency?.trim()).forEach((p: any) => {
        const raw = p.agency!.trim()
        const key = `${normAccent(raw)}::${p.portal || ''}`
        const existing = agencyFirstSeenMap.get(key)
        const date = p.created_at
        if (existing) {
            existing.count++
            if (date < existing.firstSeen) existing.firstSeen = date
        } else {
            agencyFirstSeenMap.set(key, { name: raw, portal: p.portal || '', firstSeen: date, count: 1 })
        }
    })
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const newAgencies = Array.from(agencyFirstSeenMap.values())
        .filter(a => new Date(a.firstSeen) >= threeDaysAgo)
        .sort((a, b) => new Date(b.firstSeen).getTime() - new Date(a.firstSeen).getTime())

    // --- Monthly stats ---
    const monthlyMap = new Map<string, Map<string, { total: number; agencies: Set<string> }>>()
    allProps.forEach((p: any) => {
        const date = new Date(p.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const portal = p.portal || 'Desconocido'
        const agencyKey = normAccent(p.agency || '')
        if (!monthlyMap.has(monthKey)) monthlyMap.set(monthKey, new Map())
        const portalMap = monthlyMap.get(monthKey)!
        const existing = portalMap.get(portal)
        if (existing) {
            existing.total++
            if (agencyKey) existing.agencies.add(agencyKey)
        } else {
            const agencies = new Set<string>()
            if (agencyKey) agencies.add(agencyKey)
            portalMap.set(portal, { total: 1, agencies })
        }
    })
    const monthlyStats: { month: string; portal: string; total: number; agencies: number }[] = []
    monthlyMap.forEach((portalMap, month) => {
        portalMap.forEach((data, portal) => {
            monthlyStats.push({ month, portal, total: data.total, agencies: data.agencies.size })
        })
    })
    monthlyStats.sort((a, b) => b.month.localeCompare(a.month) || b.total - a.total)

    return {
        success: true,
        data: {
            project: access.project,
            stats: {
                properties: propertiesCount.count || 0,
                logs: logsCount.count || 0,
                tickets: ticketsCount.count || 0,
                updates: updatesCount.count || 0,
                agencies: agencyData.size,
            },
            topAgencies,
            allAgencies,
            platformStats,
            newAgencies,
            monthlyStats,
            userRole: access.profile.role,
        }
    }
}

/**
 * Obtener propiedades del proyecto con paginación y filtros
 */
export async function getProjectProperties(
    projectId: string,
    options: {
        page?: number
        perPage?: number
        neighborhood?: string
        minPrice?: number
        maxPrice?: number
        portal?: string
        agency?: string
        orderBy?: string
        orderDir?: 'asc' | 'desc'
        onlyDuplicates?: boolean
        onlyFavorites?: boolean
        startDate?: string
        endDate?: string
    } = {}
) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const {
        page = 1,
        perPage = 20,
        neighborhood,
        minPrice,
        maxPrice,
        portal,
        agency,
        orderBy = 'created_at',
        orderDir = 'desc',
        onlyDuplicates = false,
        onlyFavorites = false,
        startDate,
        endDate
    } = options
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
        .from('scraper_properties')
        .select('*', { count: 'exact' })
        .eq('project_id', projectId)

    // Handle ordering
    if (orderBy === 'm2') {
        const orderPart = `CAST(NULLIF(regexp_replace(m2, '[^0-9.]', '', 'g'), '') AS NUMERIC)`
        query = query.order(orderPart, { ascending: orderDir === 'asc', nullsFirst: false })
    } else {
        query = query.order(orderBy, { ascending: orderDir === 'asc' })
    }

    if (neighborhood) {
        query = query.ilike('neighborhood', `%${neighborhood}%`)
    }
    if (minPrice) {
        query = query.gte('price', minPrice)
    }
    if (maxPrice) {
        query = query.lte('price', maxPrice)
    }
    if (portal) {
        query = query.eq('portal', portal)
    }
    if (agency && agency.trim()) {
        query = query.ilike('agency', `%${agency.trim()}%`)
    }
    // onlyDuplicates filter is applied in JS after grouping (cross-portal duplicates only)
    if (startDate) {
        query = query.gte('created_at', startDate)
    }
    if (endDate) {
        // Add 23:59:59 to endDate if it's just a date string
        const endStr = endDate.includes('T') ? endDate : `${endDate}T23:59:59`
        query = query.lte('created_at', endStr)
    }
    if (onlyFavorites) {
        query = query.eq('favourite', true)
    }

    const { data: rawData, count: totalRawCount, error } = await query

    if (error) {
        console.error('Error fetching properties:', error)
        return { error: 'Error al obtener propiedades' }
    }

    // JS Consolidation Logic
    // Duplicados: misma inmobiliaria + mismo precio + ubicación similar (LIKE, no exacta). El título NO influye.
    // Al mergear ML + otro portal: priorizar datos del otro portal.
    const ML = 'Mercado Libre'
    const isML = (portal: string) => (portal || '').toLowerCase().includes('mercado') && (portal || '').toLowerCase().includes('libre')

    const norm = (s: string) => (s || '').toLowerCase().trim()
    const normAccent = (s: string) =>
        (s || '')
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .toLowerCase()
            .trim()
    const neighborhoodsMatch = (a: string, b: string) => {
        const na = norm(a)
        const nb = norm(b)
        if (!na || !nb) return na === nb
        return na.includes(nb) || nb.includes(na)
    }
    const agenciesMatch = (a: string, b: string) => normAccent(a) === normAccent(b)
    const priceMatch = (a: unknown, b: unknown) => Number(a) === Number(b) && Number(a) > 0

    const agencyPhoneCounts = new Map<string, Map<string, number>>()
    rawData?.forEach((p) => {
        const key = normAccent(p.agency || '')
        const phone = p.phone?.trim()
        if (!key || !phone) return
        if (!agencyPhoneCounts.has(key)) agencyPhoneCounts.set(key, new Map())
        const m = agencyPhoneCounts.get(key)!
        m.set(phone, (m.get(phone) || 0) + 1)
    })
    const agencyPhoneMap = new Map<string, string>()
    agencyPhoneCounts.forEach((counts, key) => {
        let top = ''
        let max = 0
        counts.forEach((c, ph) => { if (c > max) { max = c; top = ph } })
        if (top) agencyPhoneMap.set(key, top)
    })

    const groups: any[] = []
    rawData?.forEach((p) => {
        const match = groups.find(
            (g) =>
                agenciesMatch(g.agency, p.agency) &&
                priceMatch(g.price, p.price) &&
                neighborhoodsMatch(g.neighborhood, p.neighborhood)
        )
        if (match) {
            match.portal_count++
            if (!match.portals.some((x: string) => norm(x) === norm(p.portal))) {
                match.portals.push(p.portal)
                match.all_links.push({ portal: p.portal, link: p.link })
            }
            // Priorizar datos de portales NO-ML sobre Mercado Libre
            const pIsML = isML(p.portal)
            const setIf = (dst: any, key: string, val: any) => {
                const v = val != null ? String(val).trim() : ''
                if (!v) return
                if (pIsML) {
                    if (!dst[key] || !String(dst[key]).trim()) dst[key] = val
                } else {
                    dst[key] = val
                }
            }
            setIf(match, 'title', p.title)
            setIf(match, 'neighborhood', p.neighborhood)
            setIf(match, 'phone', p.phone)
            setIf(match, 'img_url', p.img_url)
            setIf(match, 'm2', p.m2)
            if ((p as any).description) setIf(match, 'description', (p as any).description)
            if (new Date(p.created_at) < new Date(match.created_at)) match.created_at = p.created_at
            match.favourite = match.favourite || !!p.favourite
        } else {
            groups.push({
                ...p,
                portals: [p.portal],
                all_links: [{ portal: p.portal, link: p.link }],
                portal_count: 1
            })
        }
    })

    // "Duplicado" label + agency_phone + is_favorite (desde columna favourite)
    let filteredGrouped = groups.map((p) => ({
        ...p,
        is_cross_portal_duplicate: (p.portals?.length ?? 0) > 1,
        agency_phone: agencyPhoneMap.get(normAccent(p.agency || '')) || '',
        is_favorite: !!p.favourite
    }))

    if (onlyDuplicates) {
        filteredGrouped = filteredGrouped.filter(p => p.is_cross_portal_duplicate)
    }
    if (onlyFavorites) {
        filteredGrouped = filteredGrouped.filter(p => p.is_favorite)
    }

    // Explicit sorting of grouped results since grouping can mess up DB order
    filteredGrouped.sort((a, b) => {
        let valA, valB
        if (orderBy === 'price') {
            valA = a.price || 0
            valB = b.price || 0
        } else if (orderBy === 'm2') {
            valA = parseFloat(String(a.m2).replace(/[^0-9.]/g, '')) || 0
            valB = parseFloat(String(b.m2).replace(/[^0-9.]/g, '')) || 0
        } else {
            valA = new Date(a.created_at).getTime()
            valB = new Date(b.created_at).getTime()
        }

        if (orderDir === 'asc') return valA > valB ? 1 : -1
        return valA < valB ? 1 : -1
    })

    // Manual Pagination on synthesized data
    const totalGrouped = filteredGrouped.length
    const paginated = filteredGrouped.slice(from, to + 1)

    return {
        success: true,
        data: {
            properties: paginated,
            total: totalGrouped,
            page,
            perPage,
            totalPages: Math.ceil(totalGrouped / perPage),
        }
    }
}

/**
 * Marcar o desmarcar propiedad como favorita
 */
export async function togglePropertyFavorite(projectId: string, propertyId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createAdminClient()

    const { data: prop } = await supabase
        .from('scraper_properties')
        .select('id, favourite')
        .eq('id', propertyId)
        .eq('project_id', projectId)
        .single()

    if (!prop) {
        return { error: 'Propiedad no encontrada' }
    }

    const newFavourite = !prop.favourite
    const { error } = await supabase
        .from('scraper_properties')
        .update({ favourite: newFavourite })
        .eq('id', propertyId)
        .eq('project_id', projectId)

    if (error) return { error: error.message }
    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, is_favorite: newFavourite }
}

/**
 * Consolidar duplicados en la base de datos: mismas propiedades (title, neighborhood, price, portal) se fusionan en una sola fila con la fecha más antigua.
 * Solo consolida duplicados del MISMO portal. Los duplicados entre distintos portales se mantienen como filas separadas.
 *
 * Ejecución síncrona (legado) - para proyectos pequeños. Para proyectos grandes, usar enqueueConsolidateDuplicates.
 */
export async function consolidateDuplicateProperties(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const adminSupabase = createAdminClient()
    const { runConsolidateDuplicateProperties } = await import('@/lib/jobs/tasks/consolidate-duplicates')
    const res = await runConsolidateDuplicateProperties(adminSupabase, projectId)

    if (!res.success) return { error: res.error }

    revalidatePath(`/dashboard/projects/${projectId}`)
    revalidatePath(`/dashboard/projects/${projectId}/properties`)
    return { success: true, deletedCount: res.deletedCount }
}

/**
 * Encola consolidación de duplicados para ejecución asíncrona por worker.
 * Retorna jobId para que la UI haga poll del estado.
 * Ver docs/arquitectura-inflexo.md
 */
export async function enqueueConsolidateDuplicates(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const { enqueueConsolidateDuplicates: enqueue } = await import('@/lib/jobs/queue')
    return enqueue(projectId)
}

/**
 * Obtiene el estado de un job de consolidación.
 */
export async function getConsolidationJobStatus(projectId: string, jobId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const { getJobStatus } = await import('@/lib/jobs/queue')
    return getJobStatus(jobId, projectId)
}

/**
 * Consolidar inmobiliarias: todas las propiedades de una pasan a nombre de la otra
 */
export async function consolidateAgencies(
    projectId: string,
    fromAgency: string,
    toAgency: string
) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }
    if (!fromAgency?.trim() || !toAgency?.trim()) {
        return { error: 'Debes indicar ambas inmobiliarias' }
    }

    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
    const fromKey = normAccent(fromAgency)
    const toKey = normAccent(toAgency)
    if (fromKey === toKey) {
        return { error: 'Las inmobiliarias son la misma' }
    }

    const adminSupabase = createAdminClient()
    const { data: properties, error: fetchError } = await adminSupabase
        .from('scraper_properties')
        .select('id, agency')
        .eq('project_id', projectId)

    if (fetchError) {
        console.error('Error fetching properties:', fetchError)
        return { error: 'Error al obtener propiedades' }
    }

    const idsToUpdate = (properties || [])
        .filter((p) => normAccent(p.agency || '') === fromKey)
        .map((p) => p.id)

    if (idsToUpdate.length === 0) {
        return { error: 'No se encontraron propiedades de esa inmobiliaria' }
    }

    const { error: updateError } = await adminSupabase
        .from('scraper_properties')
        .update({ agency: toAgency.trim() })
        .in('id', idsToUpdate)

    if (updateError) {
        console.error('Error updating agencies:', updateError)
        return { error: `Error al actualizar: ${updateError.message}` }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    revalidatePath(`/dashboard/projects/${projectId}/properties`)
    return { success: true, updatedCount: idsToUpdate.length }
}

/**
 * Obtener inmobiliarias enriquecidas con métricas detalladas
 */
export async function getEnrichedAgencies(
    projectId: string,
    options: { portal?: string; onlyNew?: boolean; newSinceDays?: number } = {}
) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { portal, onlyNew = false, newSinceDays = 3 } = options

    let query = supabase
        .from('scraper_properties')
        .select('agency, phone, portal, price, neighborhood, created_at')
        .eq('project_id', projectId)

    if (portal) {
        query = query.eq('portal', portal)
    }

    const { data: allProps, error } = await query
    if (error) {
        console.error('Error fetching enriched agencies:', error)
        return { error: 'Error al obtener datos de inmobiliarias' }
    }

    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

    const agencyMap = new Map<string, {
        name: string
        count: number
        portals: Set<string>
        neighborhoods: Set<string>
        prices: number[]
        totalPrice: number
        priceCount: number
        firstSeen: string
        lastSeen: string
        phoneCounts: Map<string, number>
    }>()

    ;(allProps || []).filter(p => p.agency?.trim()).forEach(p => {
        const raw = p.agency!.trim()
        const key = normAccent(raw)
        const phone = p.phone?.trim() || ''
        const portalName = p.portal || ''
        const price = Number(p.price) || 0
        const neighborhood = (p.neighborhood || '').trim()
        const date = p.created_at
        const existing = agencyMap.get(key)
        if (existing) {
            existing.count++
            if (portalName) existing.portals.add(portalName)
            if (neighborhood) existing.neighborhoods.add(normAccent(neighborhood))
            if (price > 0) { existing.totalPrice += price; existing.priceCount++; existing.prices.push(price) }
            if (date < existing.firstSeen) existing.firstSeen = date
            if (date > existing.lastSeen) existing.lastSeen = date
            if (phone) existing.phoneCounts.set(phone, (existing.phoneCounts.get(phone) || 0) + 1)
        } else {
            const portals = new Set<string>()
            if (portalName) portals.add(portalName)
            const neighborhoods = new Set<string>()
            if (neighborhood) neighborhoods.add(normAccent(neighborhood))
            const phoneCounts = new Map<string, number>()
            if (phone) phoneCounts.set(phone, 1)
            agencyMap.set(key, {
                name: raw,
                count: 1,
                portals,
                neighborhoods,
                prices: price > 0 ? [price] : [],
                totalPrice: price > 0 ? price : 0,
                priceCount: price > 0 ? 1 : 0,
                firstSeen: date,
                lastSeen: date,
                phoneCounts
            })
        }
    })

    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - newSinceDays)

    const agencies = Array.from(agencyMap.values())
        .map(a => {
            let topPhone = ''
            let maxPhoneCount = 0
            a.phoneCounts.forEach((c, p) => { if (c > maxPhoneCount) { maxPhoneCount = c; topPhone = p } })
            const isNew = new Date(a.firstSeen) >= sinceDate

            const sortedPrices = [...a.prices].sort((x, y) => x - y)
            const minPrice = sortedPrices.length > 0 ? sortedPrices[0] : 0
            const maxPrice = sortedPrices.length > 0 ? sortedPrices[sortedPrices.length - 1] : 0

            // Activity period in weeks (min 1)
            const firstMs = new Date(a.firstSeen).getTime()
            const lastMs = new Date(a.lastSeen).getTime()
            const weeksActive = Math.max(1, (lastMs - firstMs) / (7 * 24 * 60 * 60 * 1000))
            const publicationsPerWeek = Math.round((a.count / weeksActive) * 10) / 10

            const neighborhoodCount = a.neighborhoods.size
            const portalCount = a.portals.size

            // Activity score: publications * portal diversity * zone coverage (log-scaled)
            const activityScore = Math.round(
                a.count * (1 + Math.log2(portalCount)) * (1 + Math.log2(Math.max(1, neighborhoodCount)))
            )

            return {
                name: a.name,
                count: a.count,
                phone: topPhone,
                portals: Array.from(a.portals),
                avgPrice: a.priceCount > 0 ? Math.round(a.totalPrice / a.priceCount) : 0,
                minPrice,
                maxPrice,
                neighborhoodCount,
                publicationsPerWeek,
                activityScore,
                firstSeen: a.firstSeen,
                lastSeen: a.lastSeen,
                isNew
            }
        })
        .filter(a => !onlyNew || a.isNew)
        .sort((a, b) => b.count - a.count)

    return { success: true, data: agencies }
}

/**
 * Detectar propiedades compartidas entre inmobiliarias:
 * misma zona + mismo precio + distinta agencia.
 * Guarda resultados en scraper_shared_properties y retorna las detecciones.
 */
export async function detectSharedProperties(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const adminSupabase = createAdminClient()

    const { data: props, error } = await adminSupabase
        .from('scraper_properties')
        .select('id, agency, price, neighborhood, portal, title, created_at')
        .eq('project_id', projectId)
        .gt('price', 0)

    if (error) {
        console.error('Error fetching properties for shared detection:', error)
        return { error: 'Error al obtener propiedades' }
    }

    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

    // Group by (normalized neighborhood, price)
    const groups = new Map<string, typeof props>()
    ;(props || []).filter(p => p.agency && normAccent(p.agency) !== 'particular').forEach(p => {
        const key = `${normAccent(p.neighborhood || '')}::${p.price}`
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(p)
    })

    // Find groups with multiple distinct agencies
    const pairs: { property_id: string; matched_property_id: string; agency_a: string; agency_b: string; price: number; neighborhood: string }[] = []
    groups.forEach(group => {
        // Deduplicate by agency
        const byAgency = new Map<string, (typeof group)[0]>()
        group.forEach(p => {
            const key = normAccent(p.agency || '')
            if (!byAgency.has(key)) byAgency.set(key, p)
        })
        const uniqueAgencies = Array.from(byAgency.values())
        if (uniqueAgencies.length < 2) return

        // Generate pairs
        for (let i = 0; i < uniqueAgencies.length; i++) {
            for (let j = i + 1; j < uniqueAgencies.length; j++) {
                const a = uniqueAgencies[i]
                const b = uniqueAgencies[j]
                // Ensure consistent ordering to avoid duplicates
                const [first, second] = a.id < b.id ? [a, b] : [b, a]
                pairs.push({
                    property_id: first.id,
                    matched_property_id: second.id,
                    agency_a: first.agency!,
                    agency_b: second.agency!,
                    price: first.price,
                    neighborhood: first.neighborhood || ''
                })
            }
        }
    })

    // Clear old detections for this project and insert new ones
    await adminSupabase
        .from('scraper_shared_properties')
        .delete()
        .eq('project_id', projectId)

    if (pairs.length > 0) {
        const rows = pairs.map(p => ({ project_id: projectId, ...p }))
        const { error: insertError } = await adminSupabase
            .from('scraper_shared_properties')
            .insert(rows)
        if (insertError) {
            console.error('Error inserting shared properties:', insertError)
            return { error: 'Error al guardar detecciones' }
        }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, count: pairs.length }
}

/**
 * Obtener propiedades compartidas detectadas
 */
export async function getSharedProperties(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { data, error } = await supabase
        .from('scraper_shared_properties')
        .select(`
            id,
            agency_a,
            agency_b,
            price,
            neighborhood,
            detected_at,
            property:scraper_properties!scraper_shared_properties_property_id_fkey(id, title, portal, link, img_url),
            matched_property:scraper_properties!scraper_shared_properties_matched_property_id_fkey(id, title, portal, link, img_url)
        `)
        .eq('project_id', projectId)
        .order('detected_at', { ascending: false })

    if (error) {
        console.error('Error fetching shared properties:', error)
        return { error: 'Error al obtener propiedades compartidas' }
    }

    return { success: true, data: data || [] }
}

/**
 * Obtener estadísticas de mercado por barrio
 */
export async function getNeighborhoodStats(
    projectId: string,
    options: { portal?: string } = {}
) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { portal } = options

    let query = supabase
        .from('scraper_properties')
        .select('neighborhood, agency, price, portal')
        .eq('project_id', projectId)

    if (portal) {
        query = query.eq('portal', portal)
    }

    const { data: allProps, error } = await query
    if (error) {
        console.error('Error fetching neighborhood stats:', error)
        return { error: 'Error al obtener estadísticas por zona' }
    }

    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

    const neighborhoodMap = new Map<string, {
        rawName: string
        agencies: Map<string, number>
        prices: number[]
        totalProps: number
    }>()

    ;(allProps || []).filter(p => p.neighborhood?.trim()).forEach(p => {
        const raw = p.neighborhood!.trim()
        const key = normAccent(raw)
        const agencyKey = normAccent(p.agency || '')
        const price = Number(p.price) || 0
        const existing = neighborhoodMap.get(key)
        if (existing) {
            existing.totalProps++
            if (agencyKey) existing.agencies.set(agencyKey, (existing.agencies.get(agencyKey) || 0) + 1)
            if (price > 0) existing.prices.push(price)
        } else {
            const agencies = new Map<string, number>()
            if (agencyKey) agencies.set(agencyKey, 1)
            neighborhoodMap.set(key, {
                rawName: raw,
                agencies,
                prices: price > 0 ? [price] : [],
                totalProps: 1
            })
        }
    })

    const neighborhoods = Array.from(neighborhoodMap.values())
        .map(n => {
            const sorted = [...n.prices].sort((a, b) => a - b)
            const totalAgencies = n.agencies.size
            const agencyCounts = Array.from(n.agencies.entries())
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)

            // Dominance index (Herfindahl-Hirschman simplified): 0 = perfectly distributed, 1 = monopoly
            const totalFromAgencies = agencyCounts.reduce((s, a) => s + a.count, 0)
            const dominanceIndex = totalFromAgencies > 0
                ? Math.round(agencyCounts.reduce((s, a) => s + Math.pow(a.count / totalFromAgencies, 2), 0) * 100) / 100
                : 0

            return {
                neighborhood: n.rawName,
                totalProperties: n.totalProps,
                totalAgencies,
                avgPrice: sorted.length > 0 ? Math.round(sorted.reduce((s, p) => s + p, 0) / sorted.length) : 0,
                minPrice: sorted.length > 0 ? sorted[0] : 0,
                maxPrice: sorted.length > 0 ? sorted[sorted.length - 1] : 0,
                topAgencies: agencyCounts.slice(0, 5),
                dominanceIndex
            }
        })
        .filter(n => n.totalProperties >= 2)
        .sort((a, b) => b.totalProperties - a.totalProperties)

    return { success: true, data: neighborhoods }
}

/**
 * Obtener logs del proyecto
 */
export async function getProjectLogs(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { data, error } = await supabase
        .from('scraper_logs')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching logs:', error)
        return { error: 'Error al obtener logs' }
    }

    return { success: true, data: data || [] }
}

/**
 * Obtener tickets del proyecto
 */
export async function getProjectTickets(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { data, error } = await supabase
        .from('tickets')
        .select('*, created_by_profile:profiles!tickets_created_by_fkey(full_name, email)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching tickets:', error)
        return { error: 'Error al obtener tickets' }
    }

    return { success: true, data: data || [] }
}

/**
 * Crear un ticket
 */
export async function createTicket(projectId: string, data: { title: string; description?: string; priority?: string }) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { error } = await supabase
        .from('tickets')
        .insert({
            project_id: projectId,
            created_by: access.profile.id,
            title: data.title,
            description: data.description,
            priority: data.priority || 'medium',
        })

    if (error) {
        console.error('Error creating ticket:', error)
        return { error: 'Error al crear ticket' }
    }

    revalidatePath(`/dashboard/projects/${projectId}/tickets`)
    return { success: true }
}

/**
 * Obtener actualizaciones del proyecto
 */
export async function getProjectUpdates(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { data, error } = await supabase
        .from('project_updates')
        .select('*, created_by_profile:profiles!project_updates_created_by_fkey(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching updates:', error)
        return { error: 'Error al obtener actualizaciones' }
    }

    return { success: true, data: data || [] }
}

/**
 * Crear una actualización (solo master admin)
 */
export async function createProjectUpdate(
    projectId: string,
    data: { title: string; content?: string; update_type?: string }
) {
    const { user: profile } = await requireMasterAdmin()

    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase
        .from('project_updates')
        .insert({
            project_id: projectId,
            created_by: profile.id,
            title: data.title,
            content: data.content,
            update_type: data.update_type || 'info',
        })

    if (error) {
        console.error('Error creating update:', error)
        return { error: 'Error al crear actualización' }
    }

    revalidatePath(`/dashboard/projects/${projectId}/updates`)
    return { success: true }
}

/**
 * Obtener miembros del proyecto
 */
export async function getProjectMembers(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const supabase = createClient()
    const { data, error } = await supabase
        .from('project_members')
        .select('*, user:profiles!project_members_user_id_fkey(id, full_name, email)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching members:', error)
        return { error: 'Error al obtener miembros' }
    }

    return { success: true, data: data || [] }
}

/**
 * Compartir proyecto con un usuario (solo master admin)
 */
export async function shareProject(projectId: string, email: string, role: string = 'viewer') {
    const { user: profile } = await requireMasterAdmin()
    const adminSupabase = createAdminClient()

    // Buscar usuario por email
    const { data: targetProfile } = await adminSupabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', email)
        .single()

    if (!targetProfile) {
        return { error: 'Usuario no encontrado. El usuario debe estar registrado primero.' }
    }

    // Verificar si ya es miembro
    const { data: existingMember } = await adminSupabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', targetProfile.id)
        .single()

    if (existingMember) {
        return { error: 'Este usuario ya tiene acceso al proyecto' }
    }

    // Agregar como miembro
    const { error } = await adminSupabase
        .from('project_members')
        .insert({
            project_id: projectId,
            user_id: targetProfile.id,
            role: role,
            invited_by: profile.id,
        })

    if (error) {
        console.error('Error sharing project:', error)
        return { error: 'Error al compartir proyecto' }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, message: `Proyecto compartido con ${targetProfile.full_name || email}` }
}

/**
 * Remover miembro del proyecto (solo master admin)
 */
export async function removeProjectMember(projectId: string, userId: string) {
    await requireMasterAdmin()
    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId)

    if (error) {
        console.error('Error removing member:', error)
        return { error: 'Error al remover miembro' }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true }
}

/**
 * Obtener lista de proyectos accesibles por el usuario
 */
/**
 * Generar alertas automáticas basadas en el análisis de datos del scraper.
 * Inserta alertas como project_updates con update_type específico.
 * Tipos: alert_shared_property, alert_new_agency_zone, alert_high_activity.
 */
export async function generateScraperAlerts(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const adminSupabase = createAdminClient()
    const alerts: { title: string; content: string; update_type: string }[] = []

    // 1. Shared property alerts
    const sharedResult = await detectSharedProperties(projectId)
    if (sharedResult.success && sharedResult.count && sharedResult.count > 0) {
        const { data: sharedItems } = await adminSupabase
            .from('scraper_shared_properties')
            .select('agency_a, agency_b, neighborhood, price')
            .eq('project_id', projectId)
            .limit(5)

        const examples = (sharedItems || [])
            .map(s => `• ${s.neighborhood}: ${s.agency_a} vs ${s.agency_b} (U$S ${Number(s.price).toLocaleString()})`)
            .join('\n')

        alerts.push({
            title: `Se detectaron ${sharedResult.count} propiedades compartidas`,
            content: `Se encontraron propiedades publicadas por diferentes inmobiliarias en la misma zona y al mismo precio.\n\nEjemplos:\n${examples}`,
            update_type: 'alert_shared_property'
        })
    }

    // 2. New agency in zone alerts
    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

    const { data: allProps } = await adminSupabase
        .from('scraper_properties')
        .select('agency, neighborhood, created_at')
        .eq('project_id', projectId)

    if (allProps && allProps.length > 0) {
        // Detect agencies that appeared in a new neighborhood in the last 3 days
        const agencyZones = new Map<string, { firstSeen: Map<string, string> }>()
        allProps.filter(p => p.agency?.trim() && p.neighborhood?.trim()).forEach(p => {
            const agKey = normAccent(p.agency!)
            const zoneKey = normAccent(p.neighborhood!)
            if (!agencyZones.has(agKey)) agencyZones.set(agKey, { firstSeen: new Map() })
            const az = agencyZones.get(agKey)!
            const existing = az.firstSeen.get(zoneKey)
            if (!existing || p.created_at < existing) az.firstSeen.set(zoneKey, p.created_at)
        })

        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        const newEntries: string[] = []
        agencyZones.forEach((data, agKey) => {
            data.firstSeen.forEach((date, zone) => {
                if (new Date(date) >= threeDaysAgo) {
                    // Find raw agency name
                    const raw = allProps.find(p => normAccent(p.agency || '') === agKey)?.agency || agKey
                    const rawZone = allProps.find(p => normAccent(p.neighborhood || '') === zone)?.neighborhood || zone
                    newEntries.push(`• ${raw} comenzó a publicar en ${rawZone}`)
                }
            })
        })

        if (newEntries.length > 0) {
            alerts.push({
                title: `${newEntries.length} inmobiliarias en zonas nuevas`,
                content: `En los últimos 3 días se detectaron inmobiliarias publicando en zonas donde no habían aparecido antes.\n\n${newEntries.slice(0, 10).join('\n')}${newEntries.length > 10 ? `\n... y ${newEntries.length - 10} más` : ''}`,
                update_type: 'alert_new_agency_zone'
            })
        }

        // 3. High activity alert: zones with unusual activity (>= 5 props in last 24h)
        const oneDayAgo = new Date()
        oneDayAgo.setDate(oneDayAgo.getDate() - 1)
        const recentByZone = new Map<string, number>()
        allProps.filter(p => p.neighborhood?.trim() && new Date(p.created_at) >= oneDayAgo).forEach(p => {
            const zone = normAccent(p.neighborhood!)
            recentByZone.set(zone, (recentByZone.get(zone) || 0) + 1)
        })

        const highActivityZones: string[] = []
        recentByZone.forEach((count, zone) => {
            if (count >= 5) {
                const rawZone = allProps.find(p => normAccent(p.neighborhood || '') === zone)?.neighborhood || zone
                highActivityZones.push(`• ${rawZone}: ${count} publicaciones`)
            }
        })

        if (highActivityZones.length > 0) {
            alerts.push({
                title: `Alta actividad en ${highActivityZones.length} zona${highActivityZones.length !== 1 ? 's' : ''}`,
                content: `Las siguientes zonas tuvieron actividad inusual en las últimas 24 horas:\n\n${highActivityZones.join('\n')}`,
                update_type: 'alert_high_activity'
            })
        }
    }

    // Insert alerts as project_updates
    if (alerts.length > 0) {
        const rows = alerts.map(a => ({
            project_id: projectId,
            created_by: null,
            title: a.title,
            content: a.content,
            update_type: a.update_type
        }))
        const { error: insertError } = await adminSupabase
            .from('project_updates')
            .insert(rows)
        if (insertError) {
            console.error('Error inserting alerts:', insertError)
            return { error: 'Error al generar alertas' }
        }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, alertsGenerated: alerts.length }
}

export async function getAccessibleProjects() {
    const { profile } = await requireProfile()
    const supabase = createClient()

    if (profile.role === 'master_admin') {
        // Master admin ve todos los proyectos
        const { data } = await supabase
            .from('projects')
            .select('*, organization:organizations(name)')
            .order('created_at', { ascending: false })
        return { success: true, data: data || [] }
    }

    // Proyectos de su organización
    const { data: orgProjects } = await supabase
        .from('projects')
        .select('*, organization:organizations(name)')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })

    // Proyectos compartidos
    const { data: sharedProjects } = await supabase
        .from('project_members')
        .select('project_id, role, projects(*, organization:organizations(name))')
        .eq('user_id', profile.id)

    const allProjects = [
        ...(orgProjects || []).map(p => ({ ...p, accessType: 'organization' })),
        ...(sharedProjects || []).map(pm => ({ ...pm.projects, accessType: 'shared', sharedRole: pm.role })),
    ]

    // Eliminar duplicados
    const uniqueProjects = allProjects.filter((project, index, self) =>
        index === self.findIndex(p => p.id === project.id)
    )

    return { success: true, data: uniqueProjects }
}
