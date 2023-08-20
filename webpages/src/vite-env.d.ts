/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBSERVICES_HOST?: string;
  readonly VITE_WEBSERVICES_PORT?: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}