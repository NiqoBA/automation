'use server'

import type { SupabaseClient } from '@supabase/supabase-js'
import { consolidateProjectPropertiesData } from '@/lib/scraper/consolidate-project-properties'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireProfile, requireMasterAdmin } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

/** Columnas mínimas para consolidar (misma lógica que dashboard y pestaña Propiedades) */
const SCRAPER_CONSOLIDATION_COLS =
    'id, portal, agency, phone, price, neighborhood, m2, title, link, img_url, created_at, favourite'

/** Obtener solo el nombre del proyecto (usado por sidebar, sin cargar stats) */
export async function getProjectName(projectId: string): Promise<string | null> {
    const { profile } = await requireProfile()
    const supabase = createClient()
    const { data } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single()
    return data?.name ?? null
}

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

/** YYYY-MM del instante en zona Montevideo (alineado con negocio UY) */
function monthKeyMontevideo(iso: string): string {
    const d = new Date(iso)
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Montevideo',
        year: 'numeric',
        month: '2-digit',
    }).formatToParts(d)
    const y = parts.find((p) => p.type === 'year')?.value ?? '1970'
    const m = parts.find((p) => p.type === 'month')?.value ?? '01'
    return `${y}-${m}`
}

/** Inicio y fin del día actual en Uruguay (UTC-3 sin DST), como ISO para filtrar created_at */
function getUruguayTodayBoundsIso(): { startIso: string; endIso: string } {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Montevideo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date())
    const y = parts.find((p) => p.type === 'year')?.value ?? '1970'
    const m = parts.find((p) => p.type === 'month')?.value ?? '01'
    const day = parts.find((p) => p.type === 'day')?.value ?? '01'
    const dateStr = `${y}-${m}-${day}`
    const start = new Date(`${dateStr}T00:00:00.000-03:00`)
    const end = new Date(`${dateStr}T23:59:59.999-03:00`)
    return { startIso: start.toISOString(), endIso: end.toISOString() }
}

/** Misma regla que getProjectDashboard (Desglose por plataforma): +1 por portal en cada aviso consolidado */
function platformCountsFromConsolidated(consolidated: any[]): Record<string, number> {
    const counts: Record<string, number> = {}
    consolidated.forEach((g: any) => {
        const portalsList: string[] = (g.portals?.length ? g.portals : [g.portal]).filter(Boolean)
        const toCount = portalsList.length ? portalsList : ['Desconocido']
        toCount.forEach((portalName) => {
            const portal = portalName || 'Desconocido'
            counts[portal] = (counts[portal] || 0) + 1
        })
    })
    return counts
}

type ConsolidationDbFilters = {
    neighborhood?: string
    minPrice?: number
    maxPrice?: number
    portal?: string
    agency?: string
    onlyFavorites?: boolean
    startDate?: string
    endDate?: string
    onlyToday?: boolean
}

async function fetchAllRowsForConsolidation(
    supabase: SupabaseClient,
    projectId: string,
    filters: ConsolidationDbFilters
): Promise<{ rows: any[]; error?: string }> {
    const rows: any[] = []
    let offset = 0
    const pageSize = 1000
    const buildQuery = (off: number) => {
        let q = supabase
            .from('scraper_properties')
            .select(SCRAPER_CONSOLIDATION_COLS)
            .eq('project_id', projectId)
            .order('id', { ascending: true })
            .range(off, off + pageSize - 1)
        if (filters.neighborhood) q = q.ilike('neighborhood', `%${filters.neighborhood}%`)
        if (filters.minPrice) q = q.gte('price', filters.minPrice)
        if (filters.maxPrice) q = q.lte('price', filters.maxPrice)
        if (filters.portal) q = q.eq('portal', filters.portal)
        if (filters.agency?.trim()) q = q.ilike('agency', `%${filters.agency.trim()}%`)
        if (filters.onlyToday) {
            const { startIso, endIso } = getUruguayTodayBoundsIso()
            q = q.gte('created_at', startIso).lte('created_at', endIso)
        } else {
            if (filters.startDate) q = q.gte('created_at', filters.startDate)
            if (filters.endDate) {
                const endStr = filters.endDate.includes('T') ? filters.endDate : `${filters.endDate}T23:59:59`
                q = q.lte('created_at', endStr)
            }
        }
        if (filters.onlyFavorites) q = q.eq('favourite', true)
        return q
    }
    for (;;) {
        const { data: batch, error } = await buildQuery(offset)
        if (error) {
            console.error('fetchAllRowsForConsolidation:', error)
            return { rows: [], error: error.message }
        }
        const chunk = batch || []
        rows.push(...chunk)
        if (chunk.length < pageSize) break
        offset += pageSize
    }
    return { rows }
}

/**
 * Conteos por portal alineados con el dashboard (avisos consolidados, no filas crudas).
 * Sin filtro de portal en BD: cuenta en todos los portales con los mismos filtros que la tabla.
 */
export async function getPortalCounts(
    projectId: string,
    filters?: {
        agency?: string
        minPrice?: number
        maxPrice?: number
        onlyFavorites?: boolean
        onlyDuplicates?: boolean
        startDate?: string
        endDate?: string
        onlyToday?: boolean
    }
): Promise<Record<string, number>> {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) return {}
    const supabase = createClient()
    const f = filters || {}
    const { rows, error } = await fetchAllRowsForConsolidation(supabase, projectId, {
        agency: f.agency,
        minPrice: f.minPrice,
        maxPrice: f.maxPrice,
        onlyFavorites: f.onlyFavorites,
        startDate: f.startDate,
        endDate: f.endDate,
        onlyToday: f.onlyToday,
    })
    if (error) return {}
    let consolidated = consolidateProjectPropertiesData(rows)
    if (f.onlyDuplicates) {
        consolidated = consolidated.filter((p) => p.is_cross_portal_duplicate)
    }
    if (f.onlyFavorites) {
        consolidated = consolidated.filter((p) => p.is_favorite)
    }
    return platformCountsFromConsolidated(consolidated)
}

async function fetchPropertiesForDashboard(supabase: SupabaseClient, projectId: string) {
    const rows: any[] = []
    let offset = 0
    const pageSize = 1000
    for (;;) {
        const { data: batch, error } = await supabase
            .from('scraper_properties')
            .select(SCRAPER_CONSOLIDATION_COLS)
            .eq('project_id', projectId)
            .order('id', { ascending: true })
            .range(offset, offset + pageSize - 1)
        if (error) {
            console.error('fetchPropertiesForDashboard:', error)
            return { error: error.message, data: null as null }
        }
        const chunk = batch || []
        rows.push(...chunk)
        if (chunk.length < pageSize) break
        offset += pageSize
    }
    return { data: rows }
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

    // Filas completas + consolidación (misma lógica que la pestaña Propiedades) para que totales coincidan con los badges
    const [logsCount, ticketsCount, updatesCount, rawFetch] = await Promise.all([
        supabase.from('scraper_logs').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
        supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
        supabase.from('project_updates').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
        fetchPropertiesForDashboard(supabase, projectId),
    ])

    if (rawFetch.error) {
        return { error: 'Error al obtener datos del proyecto' }
    }
    const allRawRows = rawFetch.data ?? []
    const consolidated = consolidateProjectPropertiesData(allRawRows)

    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

    // --- Agencias (una fila consolidada = un aviso; cuenta por inmobiliaria como en la tabla) ---
    const agencyData = new Map<string, { name: string; count: number; phoneCounts: Map<string, number> }>()
    consolidated
        .filter((p) => p.agency?.trim())
        .forEach((p) => {
            const raw = String(p.agency).trim()
            const key = normAccent(raw)
            const phone = (p.phone || p.agency_phone || '').toString().trim()
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

    // --- Platform stats (cada portal en que aparece el aviso consolidado cuenta +1, igual que los badges) ---
    const platformMap = new Map<string, { total: number; agencies: Set<string>; totalPrice: number; priceCount: number }>()
    consolidated.forEach((g: any) => {
        const agencyKey = normAccent(g.agency || '')
        const price = Number(g.price) || 0
        const portalsList: string[] = (g.portals?.length ? g.portals : [g.portal]).filter(Boolean)
        const toCount = portalsList.length ? portalsList : ['Desconocido']
        toCount.forEach((portalName) => {
            const portal = portalName || 'Desconocido'
            const existing = platformMap.get(portal)
            if (existing) {
                existing.total++
                if (agencyKey) existing.agencies.add(agencyKey)
                if (price > 0) {
                    existing.totalPrice += price
                    existing.priceCount++
                }
            } else {
                const agencies = new Set<string>()
                if (agencyKey) agencies.add(agencyKey)
                platformMap.set(portal, {
                    total: 1,
                    agencies,
                    totalPrice: price > 0 ? price : 0,
                    priceCount: price > 0 ? 1 : 0,
                })
            }
        })
    })
    const platformStats = Array.from(platformMap.entries())
        .map(([portal, data]) => ({
            portal,
            total: data.total,
            agencies: data.agencies.size,
            avgPrice: data.priceCount > 0 ? Math.round(data.totalPrice / data.priceCount) : 0,
        }))
        .sort((a, b) => b.total - a.total)

    // --- New agencies (first seen in last 3 days) — por fila en BD / portal ---
    const agencyFirstSeenMap = new Map<string, { name: string; portal: string; firstSeen: string; count: number }>()
    allRawRows.filter((p: any) => p.agency?.trim()).forEach((p: any) => {
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
    threeDaysAgo.setHours(0, 0, 0, 0)
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const newAgencies = Array.from(agencyFirstSeenMap.values())
        .filter(a => new Date(a.firstSeen).getTime() >= threeDaysAgo.getTime())
        .sort((a, b) => new Date(b.firstSeen).getTime() - new Date(a.firstSeen).getTime())

    // --- Monthly stats (misma regla que badges: por aviso consolidado y por portal) ---
    const monthlyMap = new Map<string, Map<string, { total: number; agencies: Set<string> }>>()
    consolidated.forEach((g: any) => {
        const monthKey = monthKeyMontevideo(g.created_at)
        const agencyKey = normAccent(g.agency || '')
        const portalsList: string[] = (g.portals?.length ? g.portals : [g.portal]).filter(Boolean)
        const toCount = portalsList.length ? portalsList : ['Desconocido']
        toCount.forEach((portalName) => {
            const portal = portalName || 'Desconocido'
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
                /** Filas únicas tras consolidar (coincide con total en pestaña Propiedades) */
                properties: consolidated.length,
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
        /** Solo propiedades con created_at en el día actual (America/Montevideo); prioridad sobre startDate/endDate */
        onlyToday?: boolean
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
        endDate,
        onlyToday = false
    } = options
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    const { rows: allRows, error: fetchErr } = await fetchAllRowsForConsolidation(supabase, projectId, {
        neighborhood,
        minPrice,
        maxPrice,
        portal,
        agency,
        onlyFavorites,
        startDate,
        endDate,
        onlyToday,
    })
    if (fetchErr) {
        return { error: 'Error al obtener propiedades' }
    }

    let filteredGrouped = consolidateProjectPropertiesData(allRows)

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

const SCRAPER_PAGE_SIZE = 1000

/**
 * PostgREST limita por defecto ~1000 filas por request. Sin esto, "Todos los portales"
 * devuelve un subconjunto arbitrario y firstSeenByPortal / isNew quedan mal vs. filtrar por portal.
 */
async function fetchAllPropertiesForAgencyStats(
    supabase: SupabaseClient,
    projectId: string,
    portal?: string
) {
    const rows: {
        agency: string | null
        phone: string | null
        portal: string | null
        price: number | null
        neighborhood: string | null
        created_at: string
    }[] = []
    let offset = 0
    for (;;) {
        let q = supabase
            .from('scraper_properties')
            .select('agency, phone, portal, price, neighborhood, created_at')
            .eq('project_id', projectId)
            .order('id', { ascending: true })
            .range(offset, offset + SCRAPER_PAGE_SIZE - 1)
        if (portal) {
            q = q.eq('portal', portal)
        }
        const { data: batch, error } = await q
        if (error) {
            console.error('Error fetching enriched agencies (paginated):', error)
            return { error: error.message, data: null as null }
        }
        const chunk = batch || []
        rows.push(...chunk)
        if (chunk.length < SCRAPER_PAGE_SIZE) break
        offset += SCRAPER_PAGE_SIZE
    }
    return { data: rows }
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

    const { data: allProps, error: fetchError } = await fetchAllPropertiesForAgencyStats(
        supabase,
        projectId,
        portal
    )
    if (fetchError) {
        return { error: 'Error al obtener datos de inmobiliarias' }
    }

    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

    const agencyMap = new Map<string, {
        name: string
        count: number
        portals: Set<string>
        firstSeenByPortal: Map<string, string>
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
        const portalKey = (p.portal || '').trim()
        const price = Number(p.price) || 0
        const neighborhood = (p.neighborhood || '').trim()
        const date = p.created_at
        const existing = agencyMap.get(key)
        if (existing) {
            existing.count++
            if (portalKey) existing.portals.add(portalKey)
            if (portalKey) {
                const prev = existing.firstSeenByPortal.get(portalKey)
                if (!prev || date < prev) existing.firstSeenByPortal.set(portalKey, date)
            }
            if (neighborhood) existing.neighborhoods.add(normAccent(neighborhood))
            if (price > 0) { existing.totalPrice += price; existing.priceCount++; existing.prices.push(price) }
            if (date < existing.firstSeen) existing.firstSeen = date
            if (date > existing.lastSeen) existing.lastSeen = date
            if (phone) existing.phoneCounts.set(phone, (existing.phoneCounts.get(phone) || 0) + 1)
        } else {
            const portals = new Set<string>()
            if (portalKey) portals.add(portalKey)
            const firstSeenByPortal = new Map<string, string>()
            if (portalKey) firstSeenByPortal.set(portalKey, date)
            const neighborhoods = new Set<string>()
            if (neighborhood) neighborhoods.add(normAccent(neighborhood))
            const phoneCounts = new Map<string, number>()
            if (phone) phoneCounts.set(phone, 1)
            agencyMap.set(key, {
                name: raw,
                count: 1,
                portals,
                firstSeenByPortal,
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

    // Ventana "últimos N días": desde el inicio del día local (hoy - N) para evitar bordes raros por hora.
    const sinceDate = new Date()
    sinceDate.setHours(0, 0, 0, 0)
    sinceDate.setDate(sinceDate.getDate() - newSinceDays)

    const agencies = Array.from(agencyMap.values())
        .map(a => {
            let topPhone = ''
            let maxPhoneCount = 0
            a.phoneCounts.forEach((c, p) => { if (c > maxPhoneCount) { maxPhoneCount = c; topPhone = p } })
            // IMPORTANT:
            // - Con portal: firstSeen ya está acotado a ese portal (query filtrada).
            // - Sin portal: "nueva" si apareció en la ventana en CUALQUIER portal (firstSeenByPortal),
            //   O si solo hay filas sin portal / el mínimo global (firstSeen) cae en la ventana.
            //   Si no hacemos OR con firstSeen, filas con portal vacío nunca entran en firstSeenByPortal y isNew queda mal.
            const sinceMs = sinceDate.getTime()
            const firstSeenMs = new Date(a.firstSeen).getTime()
            const isNew = portal
                ? firstSeenMs >= sinceMs
                : Array.from(a.firstSeenByPortal.values()).some(d => new Date(d).getTime() >= sinceMs) ||
                  firstSeenMs >= sinceMs

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

    const allProps: any[] = []
    let offset = 0
    for (;;) {
        let q = supabase
            .from('scraper_properties')
            .select('neighborhood, agency, price, portal')
            .eq('project_id', projectId)
            .order('id', { ascending: true })
            .range(offset, offset + 1000 - 1)
        if (portal) q = q.eq('portal', portal)
        const { data: batch, error } = await q
        if (error) {
            console.error('Error fetching neighborhood stats:', error)
            return { error: 'Error al obtener estadísticas por zona' }
        }
        const chunk = batch || []
        allProps.push(...chunk)
        if (chunk.length < 1000) break
        offset += 1000
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

type AlertRow = {
    project_id: string
    created_by: null
    title: string
    content: string
    update_type: string
    channel: 'technical' | 'functional'
    severity: 'critical' | 'warning' | 'info' | null
    tier: string | null
    metadata: Record<string, any> | null
}

/**
 * Generar alertas automáticas (técnicas + funcionales).
 * Técnicas: salud del sistema (portales sin datos, logs viejos, scraping lento).
 * Funcionales: propiedades compartidas, nuevas inmobiliarias en zonas, alta actividad.
 */
export async function generateScraperAlerts(projectId: string) {
    const access = await verifyProjectAccess(projectId)
    if (!access.hasAccess) {
        return { error: 'No tienes acceso a este proyecto' }
    }

    const adminSupabase = createAdminClient()
    const alerts: AlertRow[] = []
    const base = { project_id: projectId, created_by: null as null }

    const normAccent = (s: string) =>
        (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

    // ─── CANAL TÉCNICO ───────────────────────────────────────────────

    // T1. Portal sin propiedades recientes (48h)
    const KNOWN_PORTALS = ['CasasYMas', 'InfoCasas', 'VeoCasas', 'Mercado Libre']
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    for (const portal of KNOWN_PORTALS) {
        const { count } = await adminSupabase
            .from('scraper_properties')
            .select('id', { count: 'exact', head: true })
            .eq('project_id', projectId)
            .eq('portal', portal)
            .gte('created_at', twoDaysAgo.toISOString())
        if ((count ?? 0) === 0) {
            alerts.push({
                ...base,
                title: `${portal}: sin datos nuevos en 48h`,
                content: `No se han registrado propiedades de ${portal} en las últimas 48 horas. Verificar que el scraping esté funcionando correctamente.`,
                update_type: 'alert_portal_stale',
                channel: 'technical',
                severity: 'warning',
                tier: null,
                metadata: { portal, hours_threshold: 48 },
            })
        }
    }

    // T2. Último log de scraping demasiado viejo (> 26h, ya que corre diario a las 18)
    const { data: lastLog } = await adminSupabase
        .from('scraper_logs')
        .select('created_at, status, error_message')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (lastLog) {
        const logAge = Date.now() - new Date(lastLog.created_at).getTime()
        const hoursAgo = Math.round(logAge / (1000 * 60 * 60))
        if (logAge > 26 * 60 * 60 * 1000) {
            alerts.push({
                ...base,
                title: `Sin logs de scraping hace ${hoursAgo}h`,
                content: `El último log de scraping tiene ${hoursAgo} horas de antigüedad. El scraper corre diariamente; esto puede indicar que n8n no procesó o que el workflow falló.`,
                update_type: 'alert_stale_logs',
                channel: 'technical',
                severity: 'critical',
                tier: null,
                metadata: { last_log_at: lastLog.created_at, hours_ago: hoursAgo },
            })
        }
        if (lastLog.status === 'error') {
            alerts.push({
                ...base,
                title: 'Último scraping terminó con error',
                content: `El último log registrado tiene status "error".\n\n${lastLog.error_message || 'Sin mensaje de error.'}`,
                update_type: 'alert_scrape_error',
                channel: 'technical',
                severity: 'critical',
                tier: null,
                metadata: { last_log_at: lastLog.created_at, error: lastLog.error_message },
            })
        }
    } else {
        alerts.push({
            ...base,
            title: 'Sin logs de scraping',
            content: 'No se encontró ningún log de scraping para este proyecto. El scraper podría no estar configurado.',
            update_type: 'alert_no_logs',
            channel: 'technical',
            severity: 'critical',
            tier: null,
            metadata: null,
        })
    }

    // T3. Ratio de duplicados cross-portal alto (> 40%)
    const { rows: recentRows } = await fetchAllRowsForConsolidation(adminSupabase, projectId, {})
    const consolidated = consolidateProjectPropertiesData(recentRows)
    const crossPortalCount = consolidated.filter(p => p.is_cross_portal_duplicate).length
    const dupRatio = consolidated.length > 0 ? crossPortalCount / consolidated.length : 0
    if (dupRatio > 0.4) {
        alerts.push({
            ...base,
            title: `Ratio de duplicados cross-portal alto: ${Math.round(dupRatio * 100)}%`,
            content: `De ${consolidated.length} avisos consolidados, ${crossPortalCount} (${Math.round(dupRatio * 100)}%) aparecen en múltiples portales. Esto puede ser normal o indicar problemas de deduplicación.`,
            update_type: 'alert_high_duplicates',
            channel: 'technical',
            severity: 'info',
            tier: null,
            metadata: { total: consolidated.length, cross_portal: crossPortalCount, ratio: Math.round(dupRatio * 100) },
        })
    }

    // ─── CANAL FUNCIONAL ─────────────────────────────────────────────

    // F1. Propiedades compartidas
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
            ...base,
            title: `${sharedResult.count} propiedades compartidas detectadas`,
            content: `Propiedades publicadas por diferentes inmobiliarias en la misma zona y precio.\n\nEjemplos:\n${examples}`,
            update_type: 'alert_shared_property',
            channel: 'functional',
            severity: null,
            tier: 'full',
            metadata: { count: sharedResult.count },
        })
    }

    // F2. Nuevas inmobiliarias en zonas (últimos 3 días)
    const allProps = recentRows
    if (allProps.length > 0) {
        const agencyZones = new Map<string, { firstSeen: Map<string, string>; rawName: string }>()
        const rawZoneMap = new Map<string, string>()
        allProps.filter((p: any) => p.agency?.trim() && p.neighborhood?.trim()).forEach((p: any) => {
            const agKey = normAccent(p.agency!)
            const zoneKey = normAccent(p.neighborhood!)
            if (!rawZoneMap.has(zoneKey)) rawZoneMap.set(zoneKey, p.neighborhood!.trim())
            if (!agencyZones.has(agKey)) agencyZones.set(agKey, { firstSeen: new Map(), rawName: p.agency!.trim() })
            const az = agencyZones.get(agKey)!
            const existing = az.firstSeen.get(zoneKey)
            if (!existing || p.created_at < existing) az.firstSeen.set(zoneKey, p.created_at)
        })

        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        const newEntries: string[] = []
        agencyZones.forEach((data, _agKey) => {
            data.firstSeen.forEach((date, zone) => {
                if (new Date(date) >= threeDaysAgo) {
                    newEntries.push(`• ${data.rawName} comenzó a publicar en ${rawZoneMap.get(zone) || zone}`)
                }
            })
        })

        if (newEntries.length > 0) {
            alerts.push({
                ...base,
                title: `${newEntries.length} inmobiliarias en zonas nuevas`,
                content: `En los últimos 3 días se detectaron inmobiliarias publicando en zonas donde no habían aparecido antes.\n\n${newEntries.slice(0, 10).join('\n')}${newEntries.length > 10 ? `\n... y ${newEntries.length - 10} más` : ''}`,
                update_type: 'alert_new_agency_zone',
                channel: 'functional',
                severity: null,
                tier: 'basic',
                metadata: { count: newEntries.length },
            })
        }

        // F3. Alta actividad por zona (>= 5 props en 24h)
        const oneDayAgo = new Date()
        oneDayAgo.setDate(oneDayAgo.getDate() - 1)
        const recentByZone = new Map<string, number>()
        allProps.filter((p: any) => p.neighborhood?.trim() && new Date(p.created_at) >= oneDayAgo).forEach((p: any) => {
            const zone = normAccent(p.neighborhood!)
            recentByZone.set(zone, (recentByZone.get(zone) || 0) + 1)
        })
        const highActivityZones: string[] = []
        recentByZone.forEach((count, zone) => {
            if (count >= 5) {
                highActivityZones.push(`• ${rawZoneMap.get(zone) || zone}: ${count} publicaciones`)
            }
        })
        if (highActivityZones.length > 0) {
            alerts.push({
                ...base,
                title: `Alta actividad en ${highActivityZones.length} zona${highActivityZones.length !== 1 ? 's' : ''}`,
                content: `Zonas con actividad notable en las últimas 24 horas:\n\n${highActivityZones.join('\n')}`,
                update_type: 'alert_high_activity',
                channel: 'functional',
                severity: null,
                tier: 'basic',
                metadata: { zones: highActivityZones.length },
            })
        }

        // F4. Resumen de nuevas propiedades del día
        const { startIso, endIso } = getUruguayTodayBoundsIso()
        const todayProps = allProps.filter((p: any) => p.created_at >= startIso && p.created_at <= endIso)
        if (todayProps.length > 0) {
            const byPortal = new Map<string, number>()
            todayProps.forEach((p: any) => {
                const portal = (p.portal || 'Desconocido').trim()
                byPortal.set(portal, (byPortal.get(portal) || 0) + 1)
            })
            const breakdown = Array.from(byPortal.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([p, c]) => `• ${p}: ${c}`)
                .join('\n')
            alerts.push({
                ...base,
                title: `${todayProps.length} propiedades nuevas hoy`,
                content: `Desglose por portal:\n${breakdown}`,
                update_type: 'alert_daily_properties',
                channel: 'functional',
                severity: null,
                tier: 'basic',
                metadata: { total: todayProps.length, by_portal: Object.fromEntries(byPortal) },
            })
        }
    }

    // ─── INSERT ──────────────────────────────────────────────────────

    if (alerts.length > 0) {
        const { error: insertError } = await adminSupabase
            .from('project_updates')
            .insert(alerts)
        if (insertError) {
            console.error('Error inserting alerts:', insertError)
            return { error: 'Error al generar alertas' }
        }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    const technical = alerts.filter(a => a.channel === 'technical').length
    const functional = alerts.filter(a => a.channel === 'functional').length
    return { success: true, alertsGenerated: alerts.length, technical, functional }
}

/**
 * Health check rápido del sistema: verifica estado sin insertar alertas.
 * Solo master_admin. Devuelve lista de issues encontrados.
 */
export async function checkSystemHealth(projectId: string) {
    const { user } = await requireMasterAdmin()
    const adminSupabase = createAdminClient()
    const issues: { type: string; severity: string; message: string; metadata?: any }[] = []

    // 1. Último log
    const { data: lastLog } = await adminSupabase
        .from('scraper_logs')
        .select('created_at, status, error_message')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (!lastLog) {
        issues.push({ type: 'no_logs', severity: 'critical', message: 'No hay logs de scraping' })
    } else {
        const hoursAgo = Math.round((Date.now() - new Date(lastLog.created_at).getTime()) / 3600000)
        if (hoursAgo > 26) {
            issues.push({ type: 'stale_logs', severity: 'critical', message: `Último log hace ${hoursAgo}h`, metadata: { hours_ago: hoursAgo } })
        }
        if (lastLog.status === 'error') {
            issues.push({ type: 'last_error', severity: 'critical', message: `Último scraping con error: ${lastLog.error_message || 'sin detalle'}` })
        }
    }

    // 2. Portales sin datos recientes (48h)
    const PORTALS = ['CasasYMas', 'InfoCasas', 'VeoCasas', 'Mercado Libre']
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    for (const portal of PORTALS) {
        const { count } = await adminSupabase
            .from('scraper_properties')
            .select('id', { count: 'exact', head: true })
            .eq('project_id', projectId)
            .eq('portal', portal)
            .gte('created_at', twoDaysAgo.toISOString())
        if ((count ?? 0) === 0) {
            issues.push({ type: 'portal_stale', severity: 'warning', message: `${portal}: sin datos en 48h`, metadata: { portal } })
        }
    }

    // 3. Total de propiedades
    const { count: totalProps } = await adminSupabase
        .from('scraper_properties')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', projectId)

    return {
        success: true,
        data: {
            status: issues.some(i => i.severity === 'critical') ? 'critical' : issues.length > 0 ? 'warning' : 'healthy',
            issues,
            totalProperties: totalProps ?? 0,
            lastLogAt: lastLog?.created_at || null,
            lastLogStatus: lastLog?.status || null,
        }
    }
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
