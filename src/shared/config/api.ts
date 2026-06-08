/**
 * API base URL for axios.
 * - Local dev: omit VITE_API_URL → uses `/api` (Vite proxy in vite.config.ts)
 * - Vercel/production: set VITE_API_URL to your deployed backend, e.g. https://api.example.com/api
 */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim() ?? ''
  if (configured.length > 0) {
    return configured.replace(/\/$/, '')
  }

  return '/api'
}
