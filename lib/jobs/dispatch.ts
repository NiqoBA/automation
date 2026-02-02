/**
 * Dispara workflow de GitHub Actions vía repository_dispatch.
 * Best-effort: si falla, no rompe la app. No bloquea.
 * Ver docs/arquitectura-inflexo.md
 */

const EVENT_TYPE = 'job-enqueued'
const DISPATCH_URL = 'https://api.github.com/repos'

/**
 * Envía evento job-enqueued a GitHub para que el workflow jobs-worker se ejecute.
 * Requiere: GH_DISPATCH_TOKEN (PAT con repo scope), GITHUB_REPO (owner/repo)
 */
export function triggerJobWorkerDispatch(): void {
  const token = process.env.GH_DISPATCH_TOKEN
  const repo = process.env.GITHUB_REPO

  if (!token || !repo) {
    return
  }

  const [owner, repoName] = repo.split('/')
  if (!owner || !repoName) {
    return
  }

  const url = `${DISPATCH_URL}/${owner}/${repoName}/dispatches`

  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event_type: EVENT_TYPE }),
  }).catch(() => {
    // Best-effort: silenciar errores
  })
}
