export const config = {
  runtime: 'edge'
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {})
    }
  });
}

function toneFromRow(row) {
  if (row?.source_tone === 'official' || row?.verification_status === 'official') return 'official';
  if (row?.source_tone === 'editorial') return 'editorial';
  return 'reference';
}

async function createGeminiEmbedding({ apiKey, model, text, outputDimensionality }) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      model: `models/${model}`,
      content: {
        parts: [{ text }]
      },
      outputDimensionality,
      taskType: 'RETRIEVAL_QUERY'
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini embedding request failed: ${detail}`);
  }

  const payload = await response.json();
  return payload?.embedding?.values;
}

async function createOpenAIEmbedding({ apiKey, model, text }) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: text
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI embedding request failed: ${detail}`);
  }

  const payload = await response.json();
  return payload?.data?.[0]?.embedding;
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openAiApiKey = process.env.RAG_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if ((!geminiApiKey && !openAiApiKey) || !supabaseUrl || !supabaseServiceKey) {
    return json({ error: 'RAG retrieval is not configured' }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const query = typeof body?.query === 'string' ? body.query.trim() : '';
  if (!query) {
    return json({ error: 'Query is required' }, { status: 400 });
  }

  let embedding;
  try {
    if (geminiApiKey) {
      embedding = await createGeminiEmbedding({
        apiKey: geminiApiKey,
        model: process.env.RAG_GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',
        text: query,
        outputDimensionality: 1536
      });
    }
  } catch (error) {
    if (openAiApiKey) {
      try {
        embedding = await createOpenAIEmbedding({
          apiKey: openAiApiKey,
          model: process.env.RAG_EMBEDDING_MODEL || 'text-embedding-3-small',
          text: query
        });
      } catch (fallbackError) {
        return json({
          error: 'Embedding generation failed',
          detail: [
            error instanceof Error ? error.message : 'Unknown Gemini embedding error',
            fallbackError instanceof Error ? fallbackError.message : 'Unknown OpenAI embedding error'
          ].join(' | ')
        }, { status: 502 });
      }
    } else {
      return json({
        error: 'Failed to create query embedding',
        detail: error instanceof Error ? error.message : 'Unknown Gemini embedding error'
      }, { status: 502 });
    }
  }

  if (!Array.isArray(embedding) || embedding.length === 0) {
    return json({ error: 'Embedding payload was empty' }, { status: 502 });
  }

  let rpcResponse;
  try {
    rpcResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/match_rag_documents`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: supabaseServiceKey,
        authorization: `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        query_embedding: embedding,
        match_count: typeof body?.limit === 'number' ? Math.min(Math.max(body.limit, 1), 8) : 6
      })
    });
  } catch (error) {
    return json({
      error: 'Failed to reach Supabase RAG RPC',
      detail: error instanceof Error ? error.message : 'Unknown Supabase error'
    }, { status: 502 });
  }

  if (!rpcResponse.ok) {
    const detail = await rpcResponse.text();
    return json({ error: 'Supabase RAG RPC failed', detail }, { status: 502 });
  }

  const rows = await rpcResponse.json();
  const mapped = Array.isArray(rows) ? rows.map((row) => ({
    id: row.id || `remote:${row.title || 'document'}`,
    type: row.doc_type || 'venue',
    title: row.title || 'Untitled document',
    summary: row.summary || '',
    body: row.content || '',
    sourceLabel: row.source_label || row.title || 'RAG document',
    sourceTone: toneFromRow(row),
    sourceUrl: row.source_url || undefined,
    venueName: row.venue_name || undefined,
    topicId: row.topic_id || undefined,
    compareEligible: Boolean(row.venue_name),
    score: typeof row.similarity === 'number' ? row.similarity : undefined
  })) : [];

  const topScore = mapped[0]?.score || 0;
  const similarityFloor = Math.max(0.35, topScore - 0.08);
  const documents = mapped
    .filter((document) => typeof document.score !== 'number' || document.score >= similarityFloor)
    .slice(0, 4);

  return json({ mode: 'vector', documents });
}
