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

export function getAppOrigin(): string | null {
  const configured = import.meta.env.VITE_APP_URL?.trim() ?? ''
  if (configured.length > 0) {
    try {
      return new URL(configured).origin
    } catch {
      return null
    }
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return null
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

  const appOrigin = getAppOrigin()
  if (appOrigin !== null) {
    return `${appOrigin}/oauth/instagram/callback`
  }

  const apiOrigin = apiBaseOrigin()
  if (apiOrigin !== null) {
    return `${apiOrigin}/auth/instagram/callback`
  }

  return ''
}

export function getInstagramOAuthAllowedOrigins(): string[] {
  const origins = new Set<string>()

  if (typeof window !== 'undefined') {
    origins.add(window.location.origin)
  }

  const appOrigin = getAppOrigin()
  if (appOrigin !== null) {
    origins.add(appOrigin)
  }

  const apiOrigin = apiBaseOrigin()
  if (apiOrigin !== null) {
    origins.add(apiOrigin)
  }

  const extraOrigins = import.meta.env.VITE_INSTAGRAM_OAUTH_ALLOWED_ORIGINS?.split(',') ?? []
  for (const origin of extraOrigins) {
    const trimmed = origin.trim()
    if (trimmed.length > 0) {
      origins.add(trimmed)
    }
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
