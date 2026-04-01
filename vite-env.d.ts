/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_RAG_API_URL?: string
    readonly VITE_RAG_RETRIEVE_URL?: string
    readonly VITE_RAG_MODE?: 'auto' | 'local'
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
