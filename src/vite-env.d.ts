/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_META_APP_ID?: string
  readonly VITE_WHATSAPP_EMBEDDED_CONFIG_ID?: string
  readonly VITE_GRAPH_API_VERSION?: string
  readonly VITE_INSTAGRAM_APP_ID?: string
  readonly VITE_INSTAGRAM_REDIRECT_URI?: string
  readonly VITE_APP_URL?: string
  readonly VITE_INSTAGRAM_OAUTH_ALLOWED_ORIGINS?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_CLOUDFLARE_ANALYTICS_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
