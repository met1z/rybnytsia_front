/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly HOST: string
  readonly PORT: number
  readonly VITE_API_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
