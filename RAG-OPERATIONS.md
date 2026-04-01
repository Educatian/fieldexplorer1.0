# RAG Operations

이 앱의 버블 챗봇은 3단계로 동작합니다.

1. 로컬 venue/topic/CFP/용어 문서 검색
2. 가능하면 Supabase pgvector 검색 (`/api/rag-retrieve`)
3. 가능하면 Gemini 우선 grounded answer 생성 (`/api/rag`)

## 활성화 순서

1. Supabase SQL Editor에서 `supabase-rag.sql` 실행
2. 이어서 `supabase-rag-seed.sql` 실행
3. Vercel 환경변수 설정
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - 선택: `RAG_OPENAI_API_KEY`
   - 선택: `RAG_GEMINI_MODEL`
   - 선택: `RAG_GEMINI_EMBEDDING_MODEL`
   - 선택: `RAG_OPENAI_MODEL`
   - 선택: `RAG_EMBEDDING_MODEL`
4. 프런트 환경변수 설정
   - `VITE_RAG_API_URL=/api/rag`
   - `VITE_RAG_RETRIEVE_URL=/api/rag-retrieve`
   - `VITE_RAG_MODE=auto`
5. 로컬에서 embedding 채우기
   - `npm run rag:embed`
   - 전체 재생성: `npm run rag:embed -- --force`

## 현재 구조의 의미

- `api/rag-retrieve.js`
  - 질의를 embedding으로 바꾸고
  - Supabase `match_rag_documents` RPC를 호출해
  - 상위 문서를 반환합니다.
  - embedding은 Gemini 우선, OpenAI fallback 입니다.

- `scripts/fill-rag-embeddings.mjs`
  - `rag_documents`에서 embedding이 비어 있는 문서를 읽고
  - Gemini embedding API로 우선 벡터를 생성하고
  - 필요하면 OpenAI로 fallback 한 뒤
  - Supabase에 다시 저장합니다.

- `api/rag.js`
  - 검색된 문서를 근거로
  - Gemini를 우선 사용하고 필요하면 OpenAI로 fallback 합니다.

- 앱 클라이언트
  - 원격 retrieval/AI가 실패해도
  - 자동으로 로컬 grounded 답변으로 fallback 됩니다.

## 운영 팁

- `rag_documents.embedding`은 seed SQL로는 자동 생성되지 않습니다.
- 현재 retrieval 차원은 `vector(1536)` 이며 Gemini `gemini-embedding-001`의 `outputDimensionality=1536` 기준으로 맞춰져 있습니다.
- embedding이 비어 있어도 앱은 죽지 않고 로컬 모드로 계속 동작합니다.
