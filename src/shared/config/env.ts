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

  if (import.meta.env.PROD && url.startsWith('http://')) {
    url = `https://${url.slice('http://'.length)}`
  }

  return url
}

export function getMetaAppId(): string {
  return import.meta.env.VITE_META_APP_ID?.trim() ?? ''
}

export function getWhatsAppEmbeddedConfigId(): string {
  return import.meta.env.VITE_WHATSAPP_EMBEDDED_CONFIG_ID?.trim() ?? ''
}

export function getGraphApiVersion(): string {
  return import.meta.env.VITE_GRAPH_API_VERSION?.trim() || 'v25.0'
}

export function getInstagramAppId(): string {
  return import.meta.env.VITE_INSTAGRAM_APP_ID?.trim() ?? ''
}

function apiBaseOrigin(): string | null {
  const apiUrl = import.meta.env.VITE_API_URL?.trim() ?? ''
  if (apiUrl.length === 0) {
    return null
  }

  try {
    const url = new URL(apiUrl)
    url.pathname = ''
    url.search = ''
    url.hash = ''
    return url.origin
  } catch {
    return null
  }
}

export function getInstagramRedirectUri(): string {
  const configured = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI?.trim() ?? ''
  if (configured.length > 0) {
    return configured
  }

  const apiOrigin = apiBaseOrigin()
  if (apiOrigin !== null) {
    return `${apiOrigin}/auth/instagram/callback`
  }

  return ''
}

export function getInstagramOAuthAllowedOrigins(): string[] {
  const origins = new Set<string>()
  origins.add(window.location.origin)

  const apiOrigin = apiBaseOrigin()
  if (apiOrigin !== null) {
    origins.add(apiOrigin)
  }

  return [...origins]
}

export function isWhatsAppEmbeddedSignupConfigured(): boolean {
  return getMetaAppId().length > 0 && getWhatsAppEmbeddedConfigId().length > 0
}

export function isInstagramOAuthConfigured(): boolean {
  return getInstagramAppId().length > 0 && getInstagramRedirectUri().length > 0
}

export function getSupabaseUrl(): string {
  return import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
}

export function getSupabaseAnonKey(): string {
  return import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''
}
