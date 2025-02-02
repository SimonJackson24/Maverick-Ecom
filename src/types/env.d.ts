/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADOBE_COMMERCE_ENDPOINT: string;
  readonly VITE_ADOBE_COMMERCE_STORE_CODE: string;
  readonly VITE_ADOBE_COMMERCE_MEDIA_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
