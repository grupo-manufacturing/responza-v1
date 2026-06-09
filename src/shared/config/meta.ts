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

export function getInstagramRedirectUri(): string {
  return import.meta.env.VITE_INSTAGRAM_REDIRECT_URI?.trim() ?? ''
}

export function isWhatsAppEmbeddedSignupConfigured(): boolean {
  return getMetaAppId().length > 0 && getWhatsAppEmbeddedConfigId().length > 0
}

export function isInstagramOAuthConfigured(): boolean {
  return getInstagramAppId().length > 0 && getInstagramRedirectUri().length > 0
}
