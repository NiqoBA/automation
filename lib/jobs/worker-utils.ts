/**
 * Utilidades para el worker de jobs - NO usar en la Core App.
 * Usa createAdminClient que funciona en Node con env vars.
 */
import { createAdminClient } from '@/lib/supabase/admin'
import { runConsolidateDuplicateProperties } from './tasks/consolidate-duplicates'

export type JobType = 'consolidate_duplicates'

export interface JobRow {
  id: string
  type: JobType
  payload: Record<string, unknown>
  project_id: string
  status: string
  attempts: number
  max_attempts: number
}

/**
 * Obtiene el siguiente job pendiente y lo marca como running.
 * Para múltiples workers, considerar pg Advisory Locks.
 */
export async function fetchAndClaimNextJob(): Promise<JobRow | null> {
  const admin = createAdminClient()

  const { data: list } = await admin
    .from('jobs')
    .select('id, type, payload, project_id, status, attempts, max_attempts')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(1)

  if (!list?.length) return null

  const job = list[0] as JobRow
  if (job.attempts >= job.max_attempts) return null

  const { error } = await admin
    .from('jobs')
    .update({
      status: 'running',
      started_at: new Date().toISOString(),
      attempts: job.attempts + 1,
    })
    .eq('id', job.id)
    .eq('status', 'pending')

  if (error) return null

  return job
}

/**
 * Procesa un job según su tipo.
 */
export async function processJob(job: JobRow): Promise<{ ok: boolean; result?: unknown; error?: string }> {
  const admin = createAdminClient()

  if (job.type === 'consolidate_duplicates') {
    const projectId = job.payload?.projectId as string
    if (!projectId) {
      return { ok: false, error: 'projectId faltante en payload' }
    }
    const res = await runConsolidateDuplicateProperties(admin, projectId)
    if (res.success) {
      return { ok: true, result: { deletedCount: res.deletedCount } }
    }
    return { ok: false, error: res.error }
  }

  return { ok: false, error: `Tipo de job desconocido: ${job.type}` }
}

/**
 * Actualiza el estado final del job.
 */
export async function completeJob(
  jobId: string,
  success: boolean,
  result?: unknown,
  errorMessage?: string
): Promise<void> {
  const admin = createAdminClient()
  await admin
    .from('jobs')
    .update({
      status: success ? 'completed' : 'failed',
      result: result ? (typeof result === 'object' ? result : { value: result }) : null,
      error_message: errorMessage || null,
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId)
}
