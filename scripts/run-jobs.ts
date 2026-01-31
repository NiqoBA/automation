#!/usr/bin/env npx tsx
/**
 * Worker de jobs - ejecutar fuera del request/response.
 * Uso: npx tsx scripts/run-jobs.ts
 * Programar con cron o GitHub Actions.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { fetchAndClaimNextJob, processJob, completeJob } from '../lib/jobs/worker-utils'

async function main() {
  const job = await fetchAndClaimNextJob()
  if (!job) {
    process.exit(0)
  }

  console.log(`[Worker] Procesando job ${job.id} (${job.type})`)
  const outcome = await processJob(job)

  await completeJob(job.id, outcome.ok, outcome.result, outcome.error)

  if (outcome.ok) {
    console.log(`[Worker] Job ${job.id} completado:`, outcome.result)
  } else {
    console.error(`[Worker] Job ${job.id} falló:`, outcome.error)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('[Worker] Error fatal:', err)
  process.exit(1)
})
