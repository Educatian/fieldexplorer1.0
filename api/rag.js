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

function extractOutputText(payload) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const fragments = [];
  for (const item of payload?.output || []) {
    for (const part of item?.content || []) {
      if (typeof part?.text === 'string') {
        fragments.push(part.text);
      }
    }
  }
  return fragments.join('\n').trim();
}

function extractGeminiText(payload) {
  const texts = [];
  for (const candidate of payload?.candidates || []) {
    for (const part of candidate?.content?.parts || []) {
      if (typeof part?.text === 'string') {
        texts.push(part.text);
      }
    }
  }
  return texts.join('\n').trim();
}

async function generateWithGemini({ apiKey, model, systemPrompt, userPrompt }) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            answer: { type: 'string' },
            suggestions: {
              type: 'array',
              items: { type: 'string' }
            },
            warnings: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['answer', 'suggestions', 'warnings']
        }
      }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed: ${detail}`);
  }

  const payload = await response.json();
  return JSON.parse(extractGeminiText(payload) || '{}');
}

async function generateWithOpenAI({ apiKey, model, systemPrompt, userPrompt }) {
  const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: systemPrompt }]
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: userPrompt }]
        }
      ],
      max_output_tokens: 700,
      text: {
        format: {
          type: 'json_schema',
          name: 'rag_answer',
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              answer: { type: 'string' },
              suggestions: {
                type: 'array',
                items: { type: 'string' },
                maxItems: 4
              },
              warnings: {
                type: 'array',
                items: { type: 'string' },
                maxItems: 3
              }
            },
            required: ['answer', 'suggestions', 'warnings']
          }
        }
      }
    })
  });

  if (!openAiResponse.ok) {
    const detail = await openAiResponse.text();
    throw new Error(`OpenAI request failed: ${detail}`);
  }

  const payload = await openAiResponse.json();
  return JSON.parse(extractOutputText(payload) || '{}');
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openAiApiKey = process.env.RAG_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!geminiApiKey && !openAiApiKey) {
    return json({ error: 'No AI generation key is configured' }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const query = typeof body?.query === 'string' ? body.query.trim() : '';
  const currentContext = typeof body?.currentContext === 'string' ? body.currentContext.trim() : '';
  const documents = Array.isArray(body?.documents) ? body.documents.slice(0, 8) : [];

  if (!query) {
    return json({ error: 'Query is required' }, { status: 400 });
  }

  const openAiModel = process.env.RAG_OPENAI_MODEL || 'gpt-4.1-mini';
  const geminiModel = process.env.RAG_GEMINI_MODEL || 'gemini-2.5-flash';

  const systemPrompt = [
    'You are a grounded research assistant for an academic venue explorer.',
    'Answer in Korean.',
    'Use only the provided retrieval documents.',
    'If evidence is partial, say so plainly.',
    'Never invent deadlines, rankings, or official status.',
    'Prefer concise answers that help the user act inside the app.',
    'Return valid JSON with keys: answer, suggestions, warnings.'
  ].join(' ');

  const retrievalBlock = documents.map((document, index) => [
    `# Document ${index + 1}`,
    `title: ${document?.title || ''}`,
    `type: ${document?.type || ''}`,
    `summary: ${document?.summary || ''}`,
    `source_label: ${document?.sourceLabel || ''}`,
    `source_url: ${document?.sourceUrl || ''}`,
    `body:\n${document?.body || ''}`
  ].join('\n')).join('\n\n');

  const userPrompt = [
    `User question: ${query}`,
    currentContext ? `Current selected venue/context: ${currentContext}` : '',
    'Retrieved evidence:',
    retrievalBlock || 'No retrieval documents were found.'
  ].filter(Boolean).join('\n\n');

  let parsed;
  try {
    if (geminiApiKey) {
      parsed = await generateWithGemini({
        apiKey: geminiApiKey,
        model: geminiModel,
        systemPrompt,
        userPrompt
      });
    } else if (openAiApiKey) {
      parsed = await generateWithOpenAI({
        apiKey: openAiApiKey,
        model: openAiModel,
        systemPrompt,
        userPrompt
      });
    }
  } catch (error) {
    if (geminiApiKey && openAiApiKey) {
      try {
        parsed = await generateWithOpenAI({
          apiKey: openAiApiKey,
          model: openAiModel,
          systemPrompt,
          userPrompt
        });
      } catch (fallbackError) {
        return json({
          error: 'Gemini and OpenAI generation both failed',
          detail: [
            error instanceof Error ? error.message : 'Unknown Gemini error',
            fallbackError instanceof Error ? fallbackError.message : 'Unknown OpenAI error'
          ].join(' | ')
        }, { status: 502 });
      }
    } else {
      return json({
        error: 'AI generation failed',
        detail: error instanceof Error ? error.message : 'Unknown AI error'
      }, { status: 502 });
    }
  }

  return json({
    mode: geminiApiKey ? 'gemini' : 'openai',
    answer: parsed?.answer || '',
    suggestions: Array.isArray(parsed?.suggestions) ? parsed.suggestions : [],
    warnings: Array.isArray(parsed?.warnings) ? parsed.warnings : []
  });
}
