/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_META_APP_ID?: string
  readonly VITE_WHATSAPP_EMBEDDED_CONFIG_ID?: string
  readonly VITE_GRAPH_API_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
