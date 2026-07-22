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

function parseConfiguredOrigins(value: string): string[] {
  const origins: string[] = []

  for (const part of value.split(',')) {
    const trimmed = part.trim()
    if (trimmed.length === 0) {
      continue
    }

    try {
      origins.push(new URL(trimmed).origin)
    } catch {
      continue
    }
  }

  return origins
}

function getAppOrigins(): string[] {
  const configured = import.meta.env.VITE_APP_URL?.trim() ?? ''
  if (configured.length > 0) {
    return parseConfiguredOrigins(configured)
  }

  if (typeof window !== 'undefined') {
    return [window.location.origin]
  }

  return []
}

export function getAppOrigin(): string | null {
  const origins = getAppOrigins()
  if (origins.length === 0) {
    return typeof window !== 'undefined' ? window.location.origin : null
  }

  if (typeof window !== 'undefined' && origins.includes(window.location.origin)) {
    return window.location.origin
  }

  return origins[0] ?? null
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

  for (const origin of getAppOrigins()) {
    origins.add(origin)
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

export function getGoogleClientId(): string {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''
}

export function getGmailRedirectUri(): string {
  const configured = import.meta.env.VITE_GMAIL_REDIRECT_URI?.trim() ?? ''
  if (configured.length > 0) {
    return configured
  }

  const appOrigin = getAppOrigin()
  if (appOrigin !== null) {
    return `${appOrigin}/oauth/gmail/callback`
  }

  const apiOrigin = apiBaseOrigin()
  if (apiOrigin !== null) {
    return `${apiOrigin}/auth/gmail/callback`
  }

  return ''
}

export function getGmailOAuthAllowedOrigins(): string[] {
  const origins = new Set<string>()

  if (typeof window !== 'undefined') {
    origins.add(window.location.origin)
  }

  const appOrigin = getAppOrigin()
  if (appOrigin !== null) {
    origins.add(appOrigin)
  }

  for (const origin of getAppOrigins()) {
    origins.add(origin)
  }

  const apiOrigin = apiBaseOrigin()
  if (apiOrigin !== null) {
    origins.add(apiOrigin)
  }

  const extraOrigins = import.meta.env.VITE_GMAIL_OAUTH_ALLOWED_ORIGINS?.split(',') ?? []
  for (const origin of extraOrigins) {
    const trimmed = origin.trim()
    if (trimmed.length > 0) {
      origins.add(trimmed)
    }
  }

  return [...origins]
}

export function isGmailOAuthConfigured(): boolean {
  return getGoogleClientId().length > 0 && getGmailRedirectUri().length > 0
}

export function getSupabaseUrl(): string {
  return import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
}

export function getSupabaseAnonKey(): string {
  return import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''
}

export function getVercelAnalyticsUrl(): string {
  return import.meta.env.VITE_VERCEL_ANALYTICS_URL?.trim() ?? ''
}

export function getVercelSpeedInsightsUrl(): string {
  return import.meta.env.VITE_VERCEL_SPEED_INSIGHTS_URL?.trim() ?? ''
}
