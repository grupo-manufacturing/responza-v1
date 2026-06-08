const DEFAULT_GRAPH_API_VERSION = 'v25.0'

export function getMetaAppId(): string {
  return import.meta.env.VITE_META_APP_ID?.trim() ?? ''
}

export function getWhatsAppEmbeddedConfigId(): string {
  return import.meta.env.VITE_WHATSAPP_EMBEDDED_CONFIG_ID?.trim() ?? ''
}

export function getGraphApiVersion(): string {
  return import.meta.env.VITE_GRAPH_API_VERSION?.trim() || DEFAULT_GRAPH_API_VERSION
}

export function isWhatsAppConnectConfigured(): boolean {
  return getMetaAppId().length > 0 && getWhatsAppEmbeddedConfigId().length > 0
}
