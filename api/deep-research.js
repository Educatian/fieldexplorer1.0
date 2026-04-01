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

function extractInteractionText(payload) {
  const outputs = Array.isArray(payload?.outputs) ? payload.outputs : [];
  for (let index = outputs.length - 1; index >= 0; index -= 1) {
    const output = outputs[index];
    if (typeof output?.text === 'string' && output.text.trim()) {
      return output.text.trim();
    }

    const parts = Array.isArray(output?.content?.parts) ? output.content.parts : [];
    const fragments = parts
      .map((part) => (typeof part?.text === 'string' ? part.text.trim() : ''))
      .filter(Boolean);

    if (fragments.length > 0) {
      return fragments.join('\n').trim();
    }
  }

  return '';
}

function buildResearchPrompt({ query, currentContext, documents }) {
  const evidenceBlock = (documents || []).slice(0, 6).map((document, index) => [
    `# App evidence ${index + 1}`,
    `title: ${document?.title || ''}`,
    `type: ${document?.type || ''}`,
    `summary: ${document?.summary || ''}`,
    `source_label: ${document?.sourceLabel || ''}`,
    `source_url: ${document?.sourceUrl || ''}`,
    `body:`,
    `${document?.body || ''}`
  ].join('\n')).join('\n\n');

  return [
    'You are preparing a deep research report for an academic venue explorer product.',
    'Answer in Korean.',
    'Use web research actively and prefer official conference, journal, and society pages when dates, CFP status, or policy details matter.',
    'Treat the app evidence below as context from the product, not as guaranteed truth.',
    'If the app evidence conflicts with fresher official web sources, say so clearly.',
    'Be explicit about what is verified, what is inferred, and what still needs confirmation.',
    'Keep the report practical for a user exploring journals, conferences, topics, and CFPs inside the app.',
    '',
    `User question: ${query}`,
    currentContext ? `Current app context: ${currentContext}` : '',
    evidenceBlock ? `App evidence snapshot:\n\n${evidenceBlock}` : '',
    '',
    'Return a compact report with these sections:',
    '1. 핵심 요약',
    '2. 확인된 근거',
    '3. 앱에서 바로 해볼 다음 탐색',
    '4. 주의할 점',
    '',
    'When useful, include direct links inline.'
  ].filter(Boolean).join('\n\n');
}

async function createInteraction({ apiKey, agent, prompt }) {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      input: prompt,
      agent,
      background: true
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Deep Research create failed: ${detail}`);
  }

  return response.json();
}

async function getInteraction({ apiKey, interactionId }) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/interactions/${encodeURIComponent(interactionId)}`, {
    method: 'GET',
    headers: {
      'x-goog-api-key': apiKey
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Deep Research status failed: ${detail}`);
  }

  return response.json();
}

export default async function handler(request) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const agent = process.env.RAG_GEMINI_DEEP_RESEARCH_AGENT || 'deep-research-pro-preview-12-2025';

  if (!geminiApiKey) {
    return json({ error: 'Gemini API key is not configured' }, { status: 503 });
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const interactionId = (url.searchParams.get('id') || '').trim();
    if (!interactionId) {
      return json({ error: 'Interaction id is required' }, { status: 400 });
    }

    try {
      const payload = await getInteraction({ apiKey: geminiApiKey, interactionId });
      return json({
        id: payload?.id || interactionId,
        status: payload?.status || 'unknown',
        text: extractInteractionText(payload)
      });
    } catch (error) {
      return json({
        error: 'Failed to retrieve Deep Research status',
        detail: error instanceof Error ? error.message : 'Unknown Deep Research status error'
      }, { status: 502 });
    }
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const query = typeof body?.query === 'string' ? body.query.trim() : '';
  const currentContext = typeof body?.currentContext === 'string' ? body.currentContext.trim() : '';
  const documents = Array.isArray(body?.documents) ? body.documents : [];

  if (!query) {
    return json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const payload = await createInteraction({
      apiKey: geminiApiKey,
      agent,
      prompt: buildResearchPrompt({ query, currentContext, documents })
    });

    return json({
      id: payload?.id,
      status: payload?.status || 'submitted',
      agent
    });
  } catch (error) {
    return json({
      error: 'Failed to start Deep Research',
      detail: error instanceof Error ? error.message : 'Unknown Deep Research error'
    }, { status: 502 });
  }
}
