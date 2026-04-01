import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
const openAiApiKey = process.env.RAG_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const embeddingModel = process.env.RAG_EMBEDDING_MODEL || 'text-embedding-3-small';
const geminiEmbeddingModel = process.env.RAG_GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
const batchSize = Math.max(1, Number.parseInt(process.env.RAG_EMBED_BATCH_SIZE || '20', 10));
const forceRefresh = process.argv.includes('--force');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

if (!geminiApiKey && !openAiApiKey) {
  console.error('Missing GEMINI_API_KEY and also missing RAG_OPENAI_API_KEY / OPENAI_API_KEY for embedding generation.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function buildEmbeddingText(row) {
  return [
    `type: ${row.doc_type || ''}`,
    `title: ${row.title || ''}`,
    `summary: ${row.summary || ''}`,
    `source_label: ${row.source_label || ''}`,
    `venue_name: ${row.venue_name || ''}`,
    `topic_id: ${row.topic_id || ''}`,
    `tags: ${Array.isArray(row.tags) ? row.tags.join(', ') : ''}`,
    '',
    row.content || ''
  ].join('\n').trim();
}

async function fetchDocuments() {
  let query = supabase
    .from('rag_documents')
    .select('id, doc_type, title, summary, content, source_label, venue_name, topic_id, tags, embedding')
    .order('created_at', { ascending: true });

  if (!forceRefresh) {
    query = query.is('embedding', null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function createEmbeddings(texts) {
  if (geminiApiKey) {
    const embeddings = [];
    for (const text of texts) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiEmbeddingModel}:embedContent`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-goog-api-key': geminiApiKey
        },
        body: JSON.stringify({
          model: `models/${geminiEmbeddingModel}`,
          content: {
            parts: [{ text }]
          },
          outputDimensionality: 1536,
          taskType: 'RETRIEVAL_DOCUMENT'
        })
      });

      if (!response.ok) {
        const detail = await response.text();
        if (!openAiApiKey) {
          throw new Error(`Gemini embedding request failed: ${detail}`);
        }
        console.warn(`Gemini embedding failed for one batch item, falling back to OpenAI. ${detail}`);
        return createEmbeddingsWithOpenAI(texts);
      }

      const payload = await response.json();
      embeddings.push(payload?.embedding?.values);
    }
    return embeddings;
  }

  return createEmbeddingsWithOpenAI(texts);
}

async function createEmbeddingsWithOpenAI(texts) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${openAiApiKey}`
    },
    body: JSON.stringify({
      model: embeddingModel,
      input: texts
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI embedding request failed: ${detail}`);
  }

  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data.map((item) => item.embedding) : [];
}

async function updateEmbedding(id, embedding) {
  const { error } = await supabase
    .from('rag_documents')
    .update({
      embedding,
      metadata: {
        embedded_at: new Date().toISOString(),
        embedding_model: geminiApiKey ? geminiEmbeddingModel : embeddingModel
      }
    })
    .eq('id', id);

  if (error) throw error;
}

async function main() {
  const rows = await fetchDocuments();
  if (rows.length === 0) {
    console.log(forceRefresh ? 'No rag_documents found to refresh.' : 'All rag_documents already have embeddings.');
    return;
  }

  console.log(`Preparing embeddings for ${rows.length} documents using ${geminiApiKey ? geminiEmbeddingModel : embeddingModel}.`);

  let processed = 0;
  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);
    const texts = batch.map(buildEmbeddingText);
    const embeddings = await createEmbeddings(texts);

    if (embeddings.length !== batch.length) {
      throw new Error(`Embedding count mismatch for batch starting at ${index}.`);
    }

    for (let i = 0; i < batch.length; i += 1) {
      await updateEmbedding(batch[i].id, embeddings[i]);
      processed += 1;
      console.log(`Embedded ${processed}/${rows.length}: ${batch[i].title}`);
    }
  }

  console.log(`Done. Updated ${processed} rag_documents rows.`);
}

main().catch((error) => {
  console.error('Failed to fill RAG embeddings.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
