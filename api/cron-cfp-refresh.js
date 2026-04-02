export const config = {
  runtime: 'edge'
};

const REFRESH_STATE_ID = 'cfp-auto-refresh';
const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
const CFP_AUTO_TARGETS = [
  { venueName: 'AERA Annual Meeting', hint: 'AERA annual meeting official submission page' },
  { venueName: 'LAK Conference', hint: 'LAK official general call or important dates page' },
  { venueName: 'EDM Conference', hint: 'EDM official important dates page' },
  { venueName: 'AIED Conference', hint: 'AIED official call for paper page' },
  { venueName: 'CHI Conference', hint: 'CHI official papers call page' },
  { venueName: 'CSCW Conference', hint: 'CSCW official papers call page' },
  { venueName: 'UIST Conference', hint: 'UIST official papers or submissions page' },
  { venueName: 'IDC Conference', hint: 'IDC official call for papers page' },
  { venueName: 'IEEE VR', hint: 'IEEE VR official call for papers page' },
  { venueName: 'ETRA Symposium', hint: 'ETRA official submission process page' },
  { venueName: 'SIGCSE Technical Symposium', hint: 'SIGCSE TS official call or dates page' },
  { venueName: 'ICER Conference', hint: 'ICER official research papers track page' }
];

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {})
    }
  });
}

function isAuthorized(request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  return request.headers.get('authorization') === `Bearer ${cronSecret}`;
}

function isoDate(value = new Date()) {
  return value.toISOString().slice(0, 10);
}

function buildResearchPrompt() {
  const targetLines = CFP_AUTO_TARGETS.map((target, index) => `${index + 1}. ${target.venueName} - ${target.hint}`).join('\n');
  return [
    'You are running a CFP refresh job for an academic venue explorer.',
    'Research only the venues listed below.',
    'Use official conference, society, ACM, IEEE, Springer, Elsevier, Taylor & Francis, or publisher pages when dates or submission policy matter.',
    'Do not infer dates.',
    'If the next cycle CFP is not officially published yet, note that clearly.',
    'Prefer the main CFP or important dates page rather than a secondary blog post.',
    'For each venue, capture the official source URL, the label of the page, the main submission deadline, any earlier abstract deadline, and the deadline timezone if the page makes it clear.',
    'Return a concise research report in English with one short block per venue so that another model can convert it into structured records.',
    '',
    `Today: ${isoDate()}`,
    '',
    'Targets:',
    targetLines
  ].join('\n');
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
    throw new Error(`Deep Research create failed: ${await response.text()}`);
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
    throw new Error(`Deep Research status failed: ${await response.text()}`);
  }

  return response.json();
}

async function extractStructuredRecords({ apiKey, model, reportText }) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{
          text: [
            'Convert the research report into structured CFP update data.',
            'Only include records that the report explicitly ties to an official source.',
            'Do not infer dates, labels, timezones, or URLs.',
            'If the report says no current CFP is published, omit that venue.',
            'Use YYYY-MM-DD date strings.',
            'Timezone must be exactly one of AoE, PT, Local.',
            'Return valid JSON.'
          ].join(' ')
        }]
      },
      contents: [
        {
          role: 'user',
          parts: [{
            text: [`Today: ${isoDate()}`, 'Research report:', reportText].join('\n\n')
          }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            records: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  venueName: { type: 'string' },
                  sourceUrl: { type: 'string' },
                  sourceLabel: { type: 'string' },
                  submissionDeadline: { type: 'string' },
                  submissionLabel: { type: 'string' },
                  abstractDeadline: { type: 'string' },
                  abstractLabel: { type: 'string' },
                  timezone: { type: 'string' },
                  notes: { type: 'string' }
                },
                required: ['venueName', 'sourceUrl', 'sourceLabel', 'submissionDeadline', 'submissionLabel', 'timezone']
              }
            }
          },
          required: ['summary', 'records']
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini extraction failed: ${await response.text()}`);
  }

  const payload = await response.json();
  const texts = [];
  for (const candidate of payload?.candidates || []) {
    for (const part of candidate?.content?.parts || []) {
      if (typeof part?.text === 'string') texts.push(part.text);
    }
  }

  return JSON.parse(texts.join('\n').trim() || '{}');
}

function isValidDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function sanitizeRecord(record) {
  const validVenueNames = new Set(CFP_AUTO_TARGETS.map((target) => target.venueName));
  if (!validVenueNames.has(record?.venueName)) return null;
  if (!isValidDate(record?.submissionDeadline)) return null;
  if (!['AoE', 'PT', 'Local'].includes(record?.timezone)) return null;
  if (typeof record?.sourceUrl !== 'string' || !/^https?:\/\//.test(record.sourceUrl)) return null;
  if (typeof record?.sourceLabel !== 'string' || !record.sourceLabel.trim()) return null;
  if (typeof record?.submissionLabel !== 'string' || !record.submissionLabel.trim()) return null;
  if (record?.abstractDeadline && !isValidDate(record.abstractDeadline)) return null;

  return {
    venue_name: record.venueName,
    submission_deadline: record.submissionDeadline,
    submission_label: record.submissionLabel.trim(),
    abstract_deadline: record?.abstractDeadline || null,
    abstract_label: record?.abstractLabel?.trim() || null,
    source_url: record.sourceUrl.trim(),
    source_label: record.sourceLabel.trim(),
    verified_at: isoDate(),
    timezone: record.timezone,
    notes: record?.notes?.trim() || null,
    verified_by: null
  };
}

async function supabaseRequest({ supabaseUrl, serviceKey, path, method = 'GET', body, query, prefer }) {
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : '';
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}${queryString}`, {
    method,
    headers: {
      'content-type': 'application/json',
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      ...(prefer ? { Prefer: prefer } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    throw new Error(`Supabase ${method} ${path} failed: ${await response.text()}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function getRefreshState({ supabaseUrl, serviceKey }) {
  const rows = await supabaseRequest({
    supabaseUrl,
    serviceKey,
    path: 'cfp_refresh_state',
    query: { id: `eq.${REFRESH_STATE_ID}`, select: '*' }
  });
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function saveRefreshState({ supabaseUrl, serviceKey, patch }) {
  await supabaseRequest({
    supabaseUrl,
    serviceKey,
    path: 'cfp_refresh_state',
    method: 'POST',
    query: { on_conflict: 'id' },
    prefer: 'resolution=merge-duplicates',
    body: [{ id: REFRESH_STATE_ID, ...patch }]
  });
}

async function applyCFPRecords({ supabaseUrl, serviceKey, rows }) {
  if (!rows.length) return;

  await supabaseRequest({
    supabaseUrl,
    serviceKey,
    path: 'cfp_verifications',
    method: 'POST',
    query: { on_conflict: 'venue_name' },
    prefer: 'resolution=merge-duplicates',
    body: rows
  });

  try {
    await supabaseRequest({
      supabaseUrl,
      serviceKey,
      path: 'cfp_verification_history',
      method: 'POST',
      body: rows.map((row) => ({
        venue_name: row.venue_name,
        action: 'upsert',
        snapshot: {
          venueName: row.venue_name,
          submissionDeadline: row.submission_deadline,
          submissionLabel: row.submission_label,
          abstractDeadline: row.abstract_deadline,
          abstractLabel: row.abstract_label,
          sourceUrl: row.source_url,
          sourceLabel: row.source_label,
          verifiedAt: row.verified_at,
          timezone: row.timezone,
          notes: row.notes
        },
        storage_mode: 'cloud',
        changed_by: null
      }))
    });
  } catch (error) {
    console.warn('[CFP] Auto refresh history write skipped:', error instanceof Error ? error.message : error);
  }
}

function isDue(state, force) {
  if (force) return true;
  const lastSuccess = state?.last_success_at ? new Date(state.last_success_at).getTime() : 0;
  if (!lastSuccess) return true;
  return Date.now() - lastSuccess >= FIFTEEN_DAYS_MS;
}

export default async function handler(request) {
  if (!isAuthorized(request)) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const deepResearchAgent = process.env.RAG_GEMINI_DEEP_RESEARCH_AGENT || 'deep-research-pro-preview-12-2025';
  const extractionModel = process.env.RAG_GEMINI_MODEL || 'gemini-2.5-flash';

  if (!geminiApiKey || !supabaseUrl || !supabaseServiceKey) {
    return json({ error: 'CFP auto refresh is not configured' }, { status: 503 });
  }

  const url = new URL(request.url);
  const force = url.searchParams.get('force') === '1';

  try {
    const state = await getRefreshState({ supabaseUrl, serviceKey: supabaseServiceKey });

    if (state?.status === 'running' && state?.interaction_id) {
      const payload = await getInteraction({
        apiKey: geminiApiKey,
        interactionId: state.interaction_id
      });

      const status = payload?.status || 'unknown';
      const reportText = extractInteractionText(payload);

      if (status === 'completed' && reportText) {
        const extracted = await extractStructuredRecords({
          apiKey: geminiApiKey,
          model: extractionModel,
          reportText
        });

        const rows = (Array.isArray(extracted?.records) ? extracted.records : [])
          .map(sanitizeRecord)
          .filter(Boolean);

        await applyCFPRecords({
          supabaseUrl,
          serviceKey: supabaseServiceKey,
          rows
        });

        const nowIso = new Date().toISOString();
        await saveRefreshState({
          supabaseUrl,
          serviceKey: supabaseServiceKey,
          patch: {
            status: 'completed',
            interaction_id: state.interaction_id,
            interaction_started_at: state.interaction_started_at || nowIso,
            last_checked_at: nowIso,
            completed_at: nowIso,
            last_success_at: nowIso,
            next_due_at: new Date(Date.now() + FIFTEEN_DAYS_MS).toISOString(),
            last_error: null,
            last_result_count: rows.length,
            last_report: reportText.slice(0, 12000),
            target_names: CFP_AUTO_TARGETS.map((target) => target.venueName)
          }
        });

        return json({
          ok: true,
          mode: 'applied',
          updatedRecords: rows.length,
          summary: extracted?.summary || null
        });
      }

      if (status === 'failed' || status === 'cancelled') {
        const nowIso = new Date().toISOString();
        await saveRefreshState({
          supabaseUrl,
          serviceKey: supabaseServiceKey,
          patch: {
            status: 'failed',
            last_checked_at: nowIso,
            completed_at: nowIso,
            last_error: `Deep Research status: ${status}`,
            last_report: reportText.slice(0, 12000)
          }
        });

        return json({
          ok: false,
          mode: 'failed',
          detail: `Deep Research status: ${status}`
        }, { status: 502 });
      }

      await saveRefreshState({
        supabaseUrl,
        serviceKey: supabaseServiceKey,
        patch: {
          status: 'running',
          last_checked_at: new Date().toISOString(),
          last_error: null
        }
      });

      return json({
        ok: true,
        mode: 'running',
        interactionId: state.interaction_id,
        interactionStatus: status
      });
    }

    if (!isDue(state, force)) {
      return json({
        ok: true,
        mode: 'skipped',
        reason: 'not_due',
        nextDueAt: state?.next_due_at || null
      });
    }

    const created = await createInteraction({
      apiKey: geminiApiKey,
      agent: deepResearchAgent,
      prompt: buildResearchPrompt()
    });

    const nowIso = new Date().toISOString();
    await saveRefreshState({
      supabaseUrl,
      serviceKey: supabaseServiceKey,
      patch: {
        status: 'running',
        interaction_id: created?.id || null,
        interaction_started_at: nowIso,
        last_checked_at: nowIso,
        completed_at: null,
        last_error: null,
        last_result_count: 0,
        last_report: null,
        target_names: CFP_AUTO_TARGETS.map((target) => target.venueName)
      }
    });

    return json({
      ok: true,
      mode: 'started',
      interactionId: created?.id || null,
      agent: deepResearchAgent,
      targetCount: CFP_AUTO_TARGETS.length
    });
  } catch (error) {
    try {
      await saveRefreshState({
        supabaseUrl,
        serviceKey: supabaseServiceKey,
        patch: {
          status: 'failed',
          last_checked_at: new Date().toISOString(),
          last_error: error instanceof Error ? error.message : 'Unknown CFP refresh error'
        }
      });
    } catch {
      // ignore secondary state write errors
    }

    return json({
      error: 'CFP auto refresh failed',
      detail: error instanceof Error ? error.message : 'Unknown CFP refresh error'
    }, { status: 502 });
  }
}
