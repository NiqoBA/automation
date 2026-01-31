/**
 * Tarea de consolidación de duplicados - ejecutable por Core App (sync) o Worker (async).
 * Ver docs/arquitectura-inflexo.md
 */
import type { SupabaseClient } from '@supabase/supabase-js'

export interface ConsolidateResult {
  success: true
  deletedCount: number
}
export interface ConsolidateError {
  success: false
  error: string
}

/**
 * Ejecuta la consolidación de duplicados en scraper_properties.
 * Misma lógica que project-actions.consolidateDuplicateProperties, extraída para
 * permitir ejecución tanto síncrona (request) como asíncrona (worker).
 */
export async function runConsolidateDuplicateProperties(
  adminSupabase: SupabaseClient,
  projectId: string
): Promise<ConsolidateResult | ConsolidateError> {
  const { data: rawData, error: fetchError } = await adminSupabase
    .from('scraper_properties')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (fetchError) {
    console.error('Error fetching properties for consolidation:', fetchError)
    return { success: false, error: 'Error al obtener propiedades' }
  }

  const norm = (s: string) => (s || '').toLowerCase().trim()
  const normAccent = (s: string) =>
    (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
  const neighborhoodsMatch = (a: string, b: string) => {
    const na = norm(a)
    const nb = norm(b)
    if (!na || !nb) return na === nb
    return na.includes(nb) || nb.includes(na)
  }
  const agenciesMatch = (a: string, b: string) => normAccent(a) === normAccent(b)
  const priceMatch = (a: unknown, b: unknown) => Number(a) === Number(b) && Number(a) > 0

  const grouped: { portal: string; rows: (typeof rawData)[0][] }[] = []
  rawData?.forEach((p) => {
    const match = grouped.find(
      (g) =>
        norm(g.rows[0].portal) === norm(p.portal) &&
        agenciesMatch(g.rows[0].agency, p.agency) &&
        priceMatch(g.rows[0].price, p.price) &&
        neighborhoodsMatch(g.rows[0].neighborhood, p.neighborhood)
    )
    if (match) match.rows.push(p)
    else grouped.push({ portal: p.portal, rows: [p] })
  })

  let deletedCount = 0
  for (const { rows } of grouped) {
    if (rows.length <= 1) continue

    const keeper = rows[0]
    const toDelete = rows.slice(1)

    for (const dup of toDelete) {
      const updates: Record<string, unknown> = {}
      if ((!keeper.phone || keeper.phone.trim() === '') && dup.phone) updates.phone = dup.phone
      if ((!keeper.img_url || keeper.img_url.trim() === '') && dup.img_url) updates.img_url = dup.img_url
      if ((!keeper.m2 || String(keeper.m2).trim() === '') && dup.m2) updates.m2 = dup.m2
      if (Object.keys(updates).length > 0) {
        await adminSupabase.from('scraper_properties').update(updates).eq('id', keeper.id)
      }
    }

    const idsToDelete = toDelete.map((r) => r.id)
    const { error: deleteError } = await adminSupabase.from('scraper_properties').delete().in('id', idsToDelete)
    if (deleteError) {
      console.error('Error deleting duplicate properties:', deleteError)
      return { success: false, error: `Error al eliminar duplicados: ${deleteError.message}` }
    }
    deletedCount += idsToDelete.length
  }

  return { success: true, deletedCount }
}
