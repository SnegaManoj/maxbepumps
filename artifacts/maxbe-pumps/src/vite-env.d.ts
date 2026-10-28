interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

