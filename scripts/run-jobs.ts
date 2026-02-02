#!/usr/bin/env npx tsx
/**
 * Worker de jobs - ejecutar fuera del request/response.
 *
 * Modos:
 *   npx tsx scripts/run-jobs.ts        → Procesa 1 job y termina (legado)
 *   npx tsx scripts/run-jobs.ts --once → Procesa TODOS los jobs pendientes y termina (event-driven)
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { fetchAndClaimNextJob, processJob, completeJob } from '../lib/jobs/worker-utils'

const isOnce = process.argv.includes('--once')

async function processOne(): Promise<boolean> {
  const job = await fetchAndClaimNextJob()
  if (!job) return false

  console.log(`[Worker] Procesando job ${job.id} (${job.type})`)
  const outcome = await processJob(job)

  await completeJob(job.id, outcome.ok, outcome.result, outcome.error)

  if (outcome.ok) {
    console.log(`[Worker] Job ${job.id} completado:`, outcome.result)
  } else {
    console.error(`[Worker] Job ${job.id} falló:`, outcome.error)
  }

  return true
}

async function main() {
  if (isOnce) {
    let processed = 0
    while (await processOne()) {
      processed++
    }
    console.log(`[Worker] Modo --once: ${processed} job(s) procesado(s)`)
  } else {
    await processOne()
  }
  process.exit(0)
}

main().catch((err) => {
  console.error('[Worker] Error fatal:', err)
  process.exit(1)
})
