/**
 * API base URL for axios.
 * - Local dev: omit VITE_API_URL → uses `/api` (Vite proxy in vite.config.ts)
 * - Production: set VITE_API_URL to your deployed backend, e.g.
 *   https://your-service.onrender.com/api  (HTTPS, include /api, no trailing slash)
 */
function collapsePathSlashes(url: string): string {
  const match = url.match(/^(https?:\/\/[^/]+)(.*)$/i)
  if (match === null) {
    return url.replace(/\/{2,}/g, '/')
  }

  const [, origin, path] = match
  return origin + path.replace(/\/{2,}/g, '/')
}

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim() ?? ''
  if (configured.length === 0) {
    return '/api'
  }

  let url = configured.replace(/\/+$/, '')
  url = collapsePathSlashes(url)

  // HTTPS page cannot call HTTP APIs (mixed content)
  if (import.meta.env.PROD && url.startsWith('http://')) {
    url = `https://${url.slice('http://'.length)}`
  }

  return url
}
