/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REVOLUT_API_KEY: string
  readonly VITE_REVOLUT_API_URL: string
  readonly VITE_REVOLUT_MERCHANT_ID: string
  readonly MODE: 'development' | 'production' | 'test'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
