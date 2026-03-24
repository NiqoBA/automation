/**
 * Misma lógica que la vista Propiedades: agrupa filas de scraper_properties que son
 * el mismo aviso en distintos portales (misma inmobiliaria + precio + ubicación similar).
 *
 * Optimizado: O(n) con Map por clave (agency_norm::price) en vez de O(n²) con find().
 */

const normAccent = (s: string) =>
    (s || '')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .trim()

const norm = (s: string) => (s || '').toLowerCase().trim()

const isML = (portal: string) =>
    (portal || '').toLowerCase().includes('mercado') && (portal || '').toLowerCase().includes('libre')

function neighborhoodsMatch(a: string, b: string) {
    const na = norm(a)
    const nb = norm(b)
    if (!na || !nb) return na === nb
    return na.includes(nb) || nb.includes(na)
}

function makeGroupKey(p: any): string {
    return `${normAccent(p.agency || '')}::${Number(p.price) || 0}`
}

export function consolidateProjectPropertiesData(rawData: any[] | null | undefined): any[] {
    if (!rawData?.length) return []

    const agencyPhoneCounts = new Map<string, Map<string, number>>()
    rawData.forEach((p) => {
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
        counts.forEach((c, ph) => {
            if (c > max) { max = c; top = ph }
        })
        if (top) agencyPhoneMap.set(key, top)
    })

    // O(n): group by composite key (agency + price), then check neighborhood within bucket
    const buckets = new Map<string, any[]>()
    rawData.forEach((p) => {
        const key = makeGroupKey(p)
        if (!buckets.has(key)) buckets.set(key, [])
        const bucket = buckets.get(key)!

        let match: any = null
        for (const g of bucket) {
            if (neighborhoodsMatch(g.neighborhood, p.neighborhood)) {
                match = g
                break
            }
        }

        if (match) {
            match.portal_count++
            if (!match.portals.some((x: string) => norm(x) === norm(p.portal))) {
                match.portals.push(p.portal)
                match.all_links.push({ portal: p.portal, link: p.link })
            }
            const pIsML = isML(p.portal)
            const setIf = (dst: any, k: string, val: any) => {
                const v = val != null ? String(val).trim() : ''
                if (!v) return
                if (pIsML) {
                    if (!dst[k] || !String(dst[k]).trim()) dst[k] = val
                } else {
                    dst[k] = val
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
            bucket.push({
                ...p,
                portals: [p.portal],
                all_links: [{ portal: p.portal, link: p.link }],
                portal_count: 1,
            })
        }
    })

    const groups: any[] = []
    buckets.forEach((bucket) => groups.push(...bucket))

    return groups.map((p) => ({
        ...p,
        is_cross_portal_duplicate: (p.portals?.length ?? 0) > 1,
        agency_phone: agencyPhoneMap.get(normAccent(p.agency || '')) || '',
        is_favorite: !!p.favourite,
    }))
}
