create extension if not exists vector;

create table if not exists public.rag_documents (
    id uuid primary key default gen_random_uuid(),
    doc_type text not null check (doc_type in ('venue', 'topic', 'cfp', 'glossary', 'context')),
    title text not null,
    summary text not null default '',
    content text not null,
    source_label text not null default '',
    source_url text,
    source_tone text not null default 'reference' check (source_tone in ('official', 'reference', 'editorial')),
    verification_status text,
    venue_name text,
    topic_id text,
    tags text[] not null default '{}',
    metadata jsonb not null default '{}'::jsonb,
    embedding vector(1536),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create or replace function public.update_rag_documents_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists rag_documents_updated_at on public.rag_documents;
create trigger rag_documents_updated_at
before update on public.rag_documents
for each row
execute function public.update_rag_documents_updated_at();

create index if not exists rag_documents_doc_type_idx on public.rag_documents (doc_type);
create index if not exists rag_documents_venue_name_idx on public.rag_documents (venue_name);
create index if not exists rag_documents_topic_id_idx on public.rag_documents (topic_id);
create index if not exists rag_documents_tags_idx on public.rag_documents using gin (tags);
create index if not exists rag_documents_embedding_idx
on public.rag_documents
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create or replace function public.match_rag_documents(
    query_embedding vector(1536),
    match_count integer default 6
)
returns table (
    id uuid,
    doc_type text,
    title text,
    summary text,
    content text,
    source_label text,
    source_url text,
    source_tone text,
    verification_status text,
    venue_name text,
    topic_id text,
    tags text[],
    metadata jsonb,
    similarity double precision
)
language sql
stable
as $$
    select
        rag_documents.id,
        rag_documents.doc_type,
        rag_documents.title,
        rag_documents.summary,
        rag_documents.content,
        rag_documents.source_label,
        rag_documents.source_url,
        rag_documents.source_tone,
        rag_documents.verification_status,
        rag_documents.venue_name,
        rag_documents.topic_id,
        rag_documents.tags,
        rag_documents.metadata,
        1 - (rag_documents.embedding <=> query_embedding) as similarity
    from public.rag_documents
    where rag_documents.embedding is not null
    order by rag_documents.embedding <=> query_embedding
    limit greatest(match_count, 1);
$$;

alter table public.rag_documents enable row level security;

drop policy if exists "RAG docs are readable" on public.rag_documents;
create policy "RAG docs are readable"
on public.rag_documents
for select
using (true);
