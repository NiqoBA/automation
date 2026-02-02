/**
 * Job Queue - Enqueue y consulta de estado.
 * El procesamiento se hace en workers externos (scripts/run-jobs).
 * Al encolar se dispara GitHub Actions vía repository_dispatch (event-driven).
 * Ver docs/arquitectura-inflexo.md
 */
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { triggerJobWorkerDispatch } from './dispatch'

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
export type JobType = 'consolidate_duplicates'

export interface JobRecord {
  id: string
  type: JobType
  payload: Record<string, unknown>
  project_id: string
  status: JobStatus
  result?: Record<string, unknown>
  error_message?: string | null
  attempts: number
  max_attempts: number
  created_at: string
  started_at?: string | null
  completed_at?: string | null
}

export interface EnqueueResult {
  success: true
  jobId: string
}
export interface EnqueueError {
  success: false
  error: string
}

/**
 * Encola un job de consolidación de duplicados.
 * Requiere acceso al proyecto (verificado en la server action que lo llama).
 */
export async function enqueueConsolidateDuplicates(
  projectId: string
): Promise<EnqueueResult | EnqueueError> {
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('jobs')
    .insert({
      type: 'consolidate_duplicates',
      payload: { projectId },
      project_id: projectId,
      status: 'pending',
      max_attempts: 3,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error enqueueing job:', error)
    return { success: false, error: error.message }
  }

  triggerJobWorkerDispatch()

  return { success: true, jobId: data.id }
}

/**
 * Obtiene el estado de un job.
 */
export async function getJobStatus(
  jobId: string,
  projectId: string
): Promise<{ success: true; job: JobRecord } | { success: false; error: string }> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('project_id', projectId)
    .single()

  if (error || !data) {
    return { success: false, error: error?.message || 'Job no encontrado' }
  }

  return { success: true, job: data as JobRecord }
}
