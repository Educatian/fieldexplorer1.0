<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FieldExplorer

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Optional: configure Supabase keys in `.env.local`
3. Optional: configure grounded RAG mode
   - `GEMINI_API_KEY=...`
   - optional fallback: `RAG_OPENAI_API_KEY=...`
   - `RAG_GEMINI_MODEL=gemini-2.5-flash`
   - `RAG_GEMINI_EMBEDDING_MODEL=gemini-embedding-001`
   - `RAG_OPENAI_MODEL=gpt-4.1-mini`
   - `VITE_RAG_API_URL=/api/rag`
   - `VITE_RAG_RETRIEVE_URL=/api/rag-retrieve`
   - `VITE_RAG_MODE=auto`
4. Run the app:
   `npm run dev`

If no generation key is configured, the floating chatbot still works in local retrieval mode and falls back to template-based grounded answers.

## Supabase RAG

To enable vector retrieval:

1. Run `supabase-rag.sql`
2. Run `supabase-rag-seed.sql`
3. Set server env vars:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - optional: `RAG_OPENAI_API_KEY`

The app then uses `/api/rag-retrieve` for pgvector retrieval and `/api/rag` for grounded answer generation. If either is unavailable, it falls back to local grounded retrieval.

4. Fill embeddings locally:
   - `npm run rag:embed`
   - optional full refresh: `npm run rag:embed -- --force`

`npm run rag:embed` now uses Gemini embeddings first when `GEMINI_API_KEY` is set, and falls back to OpenAI embeddings only if an OpenAI key is also configured.

## CFP Ops

CFP verification operations are documented in [CFP-OPERATIONS.md](./CFP-OPERATIONS.md).
General content fact-check scope is documented in [CONTENT-FACTCHECK.md](./CONTENT-FACTCHECK.md).
RAG retrieval operations are documented in [RAG-OPERATIONS.md](./RAG-OPERATIONS.md).

Use these files for shared CFP data:

- `supabase-cfp.sql`
- `supabase-cfp-seed.sql`
- `cfp-seed.json`
