/* Learning Unfolded: original, dependency-free exploratory activities. */
(function () {
  'use strict';
  let instance = 0;
  const mounted = new WeakMap();
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const percent = value => (value * 100).toFixed(1) + '%';

  function bayes(root, id, listen) {
    const defaults = { prior: 0.4, slip: 0.15, guess: 0.2 };
    const state = { ...defaults, responses: [] };
    const slider = (key, label, detail, max) => `<label class="ll-slider" for="${id}-${key}"><span><strong>${label}</strong><output id="${id}-${key}-value" for="${id}-${key}">${percent(state[key])}</output></span><input id="${id}-${key}" data-parameter="${key}" type="range" min="0.01" max="${max}" step="0.01" value="${state[key]}" aria-describedby="${id}-${key}-help"><small id="${id}-${key}-help">${detail}</small></label>`;
    root.innerHTML = `<header class="ll-header"><span class="ll-eyebrow">01 / Updating a belief</span><h3>One answer changes a belief. It does not prove a skill.</h3><p>Explore a toy binary-skill model: skill present or absent. Responses are independent given that fixed skill state; no learning or forgetting is modeled.</p></header><div class="ll-bayes-layout"><section class="ll-controls" aria-label="Model assumptions">${slider('prior', 'Prior belief', 'P(skill present), before any responses.', '0.99')}${slider('slip', 'Slip probability', 'P(incorrect | skill present).', '0.49')}${slider('guess', 'Guess probability', 'P(correct | skill absent).', '0.49')}<p class="ll-note">Changing an assumption recalculates the entire sequence. Slip and guess are limited to 1–49% in this demonstration.</p></section><section class="ll-result" aria-label="Posterior exploration"><div class="ll-reading"><span>Current belief in skill presence</span><strong data-current></strong></div><div data-chart></div><div class="ll-actions" role="group" aria-label="Add a hypothetical response"><button type="button" data-response="correct">Add correct response</button><button type="button" data-response="incorrect" class="ll-secondary">Add incorrect response</button></div><div class="ll-actions ll-actions-small"><button type="button" data-undo class="ll-quiet">Undo last response</button><button type="button" data-reset class="ll-quiet">Reset all</button><span data-step-count class="ll-note"></span></div></section></div><section class="ll-calculation" aria-label="Bayesian update calculation" data-calculation></section><details class="ll-details"><summary>Inspect the update sequence</summary><div class="ll-table-scroll" data-history></div></details><p class="ll-boundary"><strong>Model, not diagnosis.</strong> A correct response is not proof of skill: guessing is possible. These are hypothetical responses, not a valid inference about a real learner.</p><span class="ll-sr-only" role="status" aria-live="polite" data-status></span>`;
    function compute() {
      let p = state.prior;
      // Keep both joint likelihood weights, rather than subtracting a rounded
      // posterior from 1. This preserves tiny minority mass near 0% and 100%.
      let skillWeight = state.prior, absentWeight = 1 - state.prior;
      const rows = [];
      for (const response of state.responses) {
        const before = p;
        const a = response === 'correct' ? 1 - state.slip : state.slip;
        const b = response === 'correct' ? state.guess : 1 - state.guess;
        skillWeight *= a;
        absentWeight *= b;
        p = skillWeight / (skillWeight + absentWeight);
        rows.push({ response, before, a, b, after: p });
      }
      return { p, rows };
    }
    function draw(announce) {
      const { p, rows } = compute();
      root.querySelector('[data-current]').textContent = percent(p);
      for (const key of Object.keys(defaults)) {
        root.querySelector(`#${id}-${key}-value`).textContent = percent(state[key]);
        root.querySelector(`#${id}-${key}`).setAttribute('aria-valuetext', percent(state[key]));
      }
      const values = [state.prior, ...rows.map(row => row.after)];
      const left = 52, right = 688, top = 22, bottom = 190;
      const x = i => left + (right - left) * i / Math.max(8, state.responses.length);
      const y = v => bottom - (bottom - top) * v;
      const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
      root.querySelector('[data-chart]').innerHTML = `<svg class="ll-chart" viewBox="0 0 720 238" role="img" aria-labelledby="${id}-chart-title ${id}-chart-desc"><title id="${id}-chart-title">Belief after each hypothetical response</title><desc id="${id}-chart-desc">Starts at ${percent(state.prior)}. After ${rows.length} responses, ends at ${percent(p)}. Exact sequence available in the table below. Vertical axis: probability of skill presence. Horizontal axis: response number.</desc>${[0, 0.5, 1].map(v => `<line class="ll-grid" x1="${left}" y1="${y(v)}" x2="${right}" y2="${y(v)}"/><text class="ll-svg-label" x="42" y="${y(v) + 4}" text-anchor="end">${Math.round(v * 100)}%</text>`).join('')}<polyline class="ll-plot" points="${points}"/>${values.map((v, i) => `<circle class="ll-point ${i && state.responses[i - 1] === 'incorrect' ? 'll-point-incorrect' : ''}" cx="${x(i)}" cy="${y(v)}" r="4"><title>${i ? `Response ${i}, ${state.responses[i - 1]}` : 'Prior'}: ${percent(v)}</title></circle>`).join('')}${values.map((v, i) => (values.length <= 13 || i % 2 === 0 || i === values.length - 1) ? `<text class="ll-svg-label" x="${x(i)}" y="211" text-anchor="middle">${i}</text>` : '').join('')}<text class="ll-svg-label" x="370" y="232" text-anchor="middle">Response number (0 = prior)</text></svg>`;
      const last = rows[rows.length - 1];
      root.querySelector('[data-calculation]').innerHTML = last ? `<span class="ll-eyebrow">Latest update / ${last.response} response</span><p class="ll-equation">Posterior = (likelihood with skill × prior) / total response probability</p><p class="ll-numbers">(${last.a.toFixed(2)} × ${last.before.toFixed(4)}) / [(${last.a.toFixed(2)} × ${last.before.toFixed(4)}) + (${last.b.toFixed(2)} × ${(1 - last.before).toFixed(4)})] ≈ <strong>${percent(last.after)}</strong></p><p class="ll-note">Here “prior” is the belief immediately before this response. Displayed values are rounded; calculations use full precision.</p>` : `<span class="ll-eyebrow">Start with an assumption</span><p>No responses yet. The current belief is the prior, ${percent(state.prior)}. Add a hypothetical response to inspect Bayes’ rule.</p>`;
      root.querySelector('[data-history]').innerHTML = `<table class="ll-table"><caption>Belief after each response (rounded)</caption><thead><tr><th scope="col">Step</th><th scope="col">Response</th><th scope="col">Belief</th></tr></thead><tbody><tr><th scope="row">0</th><td>Prior</td><td>${percent(state.prior)}</td></tr>${rows.map((row, i) => `<tr><th scope="row">${i + 1}</th><td>${row.response}</td><td>${percent(row.after)}</td></tr>`).join('')}</tbody></table>`;
      root.querySelector('[data-undo]').disabled = rows.length === 0;
      root.querySelectorAll('[data-response]').forEach(button => { button.disabled = rows.length >= 24; });
      root.querySelector('[data-step-count]').textContent = `${rows.length} / 24 responses${rows.length === 24 ? ' · limit reached' : ''}`;
      if (announce) root.querySelector('[data-status]').textContent = `${announce} Belief: ${percent(p)}. ${rows.length} responses.`;
    }
    listen(root, 'input', event => {
      const key = event.target.dataset.parameter;
      if (!Object.prototype.hasOwnProperty.call(defaults, key)) return;
      state[key] = Number(event.target.value);
      draw('Assumptions updated.');
    });
    listen(root, 'click', event => {
      const button = event.target.closest('button');
      if (!button || !root.contains(button)) return;
      if (button.hasAttribute('data-response') && state.responses.length < 24) {
        state.responses.push(button.dataset.response);
        draw(`${button.dataset.response} response added.`);
        if (state.responses.length === 24) root.querySelector('[data-undo]').focus();
      } else if (button.hasAttribute('data-undo')) {
        state.responses.pop(); draw('Last response removed.');
      } else if (button.hasAttribute('data-reset')) {
        Object.assign(state, defaults); state.responses = [];
        Object.keys(defaults).forEach(key => { root.querySelector(`#${id}-${key}`).value = defaults[key]; });
        draw('All assumptions and responses reset.');
      }
    });
    draw();
  }

  function ecd(root, id, listen) {
    const cases = [
      { label: 'Evaluate a source', claim: 'The learner can justify a source’s credibility for a particular question.', evidence: 'A justification links a claim to its original source, checks authorship, and compares independent coverage.', task: 'Give two conflicting web accounts and access to source links. Ask which account is better supported, and require a written rationale with citations.', trace: 'Cited source passages, the comparison, and the learner’s stated reasons.', rationale: 'Conflicting accounts create a reason to corroborate. A cited explanation exposes reasoning that a simple source-choice click would hide.', limitation: 'A plausible rationale may reflect prior topic knowledge or writing support. Clicks and time-on-page alone do not establish credibility evaluation.', review: 'Review whether each reason is supported by the cited source, not just whether a preferred website was chosen.' },
      { label: 'Plan an investigation', claim: 'The learner can plan an investigation that can distinguish two competing explanations.', evidence: 'The plan identifies a variable to change, conditions to hold constant, and different predicted results for each explanation.', task: 'Offer two explanations for a simulated plant’s growth. Ask for a test plan and predictions before allowing any trial to run.', trace: 'The pre-trial plan, selected variable and controls, and paired predictions.', rationale: 'Recording predictions before a trial separates a proposed test from an explanation constructed after seeing its result.', limitation: 'A well-written plan does not show that the learner can carry it out. One task cannot establish planning skill across unfamiliar domains.', review: 'Check whether the planned observation would actually distinguish the explanations, rather than simply counting planning steps.' },
      { label: 'Debug with a test', claim: 'The learner can use a controlled test to diagnose a simple program fault.', evidence: 'A predicted failure, a targeted test, and an explanation connect a code change to the observed behavior.', task: 'Provide a short program with an off-by-one error. Ask the learner to predict a boundary-case output, run a test, revise the code, and explain the result.', trace: 'The prediction, test input and output, code revision, and explanation.', rationale: 'A boundary case can expose the fault. The prediction and explanation help distinguish a reasoned fix from a lucky edit.', limitation: 'A passing test can miss other faults. Copied fixes and tool assistance can produce working code without demonstrating independent diagnosis.', review: 'Compare the prediction with the test result and the explanation. Do not treat successful execution alone as sufficient evidence.' }
    ];
    let selected = 0;
    root.innerHTML = `<header class="ll-header"><span class="ll-eyebrow">02 / Designing an evidence argument</span><h3>What would make a learning claim believable?</h3><p>Evidence-centered design connects a competency claim to observable evidence and a task that can elicit it. Select a claim to explore a proposed design.</p></header><div class="ll-claim-picker" role="group" aria-label="Choose a competency claim">${cases.map((item, i) => `<button type="button" data-claim="${i}" aria-pressed="${i === 0}" aria-controls="${id}-design">${item.label}</button>`).join('')}</div><div id="${id}-design" data-design></div><p class="ll-boundary"><strong>Design examples, not findings.</strong> These are proposed evidence arguments, not validated assessments or empirical results. Interpretation requires human review and attention to alternative explanations.</p><span class="ll-sr-only" role="status" aria-live="polite" data-status></span>`;
    function draw(announce) {
      const item = cases[selected];
      root.querySelectorAll('[data-claim]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.claim) === selected)));
      root.querySelector('[data-design]').innerHTML = `<div class="ll-chain">${[['01', 'Competency claim', item.claim], ['02', 'Evidence needed', item.evidence], ['03', 'Task to elicit it', item.task]].map(([number, title, body]) => `<section class="ll-chain-card"><span class="ll-eyebrow">${number}</span><h4>${title}</h4><p>${body}</p></section>`).join('')}</div><p class="ll-chain-caption">Design direction: claim → evidence → task. Interpretation works back from the task response toward the claim.</p><div class="ll-evidence-grid"><section><h4>Observable trace</h4><p>${item.trace}</p></section><section><h4>Why this task?</h4><p>${item.rationale}</p></section></div><details class="ll-details" open><summary>Check the inference, not just the activity</summary><p><strong>Review:</strong> ${item.review}</p><p><strong>Limitation:</strong> ${item.limitation}</p></details>`;
      if (announce) root.querySelector('[data-status]').textContent = `${item.label} selected. The claim, evidence, task, and limitations have been updated.`;
    }
    listen(root, 'click', event => {
      const button = event.target.closest('[data-claim]');
      if (!button || !root.contains(button)) return;
      selected = Number(button.dataset.claim); draw(true);
    });
    draw();
  }

  function sequence(root, id, listen) {
    const names = ['Plan', 'Act', 'Check'];
    const initial = ['Plan', 'Act', 'Act', 'Check', 'Act', 'Check', 'Plan', 'Act', 'Check'];
    let events = [...initial], normalized = false;
    root.innerHTML = `<header class="ll-header"><span class="ll-eyebrow">03 / Reading a process</span><h3>Same actions. Different sequence.</h3><p>Edit the event labels and inspect adjacent transitions. A transition connects one event to the next; the last event does not loop back to the first.</p></header><div class="ll-sequence-layout"><section aria-labelledby="${id}-events-title"><h4 id="${id}-events-title">Event sequence</h4><p class="ll-note">Change any label or remove an event. Buttons below append a new event.</p><ol class="ll-events" data-events></ol><div class="ll-actions" role="group" aria-label="Append an event">${names.map(name => `<button type="button" class="ll-secondary" data-add="${name}">Add ${name}</button>`).join('')}</div><div class="ll-actions ll-actions-small"><button type="button" data-reset class="ll-quiet">Reset sequence and view</button><span class="ll-note" data-event-count></span></div></section><section class="ll-matrix-panel" aria-labelledby="${id}-matrix-title"><h4 id="${id}-matrix-title">Where did each event lead?</h4><label class="ll-toggle"><input type="checkbox" data-normalize> Show row percentages</label><div data-matrix></div><p class="ll-note" data-matrix-note></p><p class="ll-transition-total" data-total></p></section></div><p class="ll-boundary"><strong>Counts describe order, not quality.</strong> These invented labels omit duration and context. Transitions do not measure creativity or establish learning outcomes or causation. Row percentages are observed shares, not predictions.</p><span class="ll-sr-only" role="status" aria-live="polite" data-status></span>`;
    function drawEvents() {
      root.querySelector('[data-events]').innerHTML = events.map((event, i) => `<li class="ll-event"><span aria-hidden="true" class="ll-event-number">${String(i + 1).padStart(2, '0')}</span><label class="ll-sr-only" for="${id}-event-${i}">Event ${i + 1}</label><select id="${id}-event-${i}" data-index="${i}">${names.map(name => `<option${name === event ? ' selected' : ''}>${name}</option>`).join('')}</select><button type="button" class="ll-remove" data-remove="${i}" aria-label="Remove event ${i + 1}: ${event}">Remove</button></li>`).join('');
      if (!events.length) root.querySelector('[data-events]').innerHTML = '<li class="ll-empty">No events. Add a label to begin.</li>';
    }
    function drawMatrix(announce) {
      const counts = names.map(() => [0, 0, 0]);
      for (let i = 0; i < events.length - 1; i++) counts[names.indexOf(events[i])][names.indexOf(events[i + 1])]++;
      const totals = counts.map(row => row.reduce((a, b) => a + b, 0));
      const maximum = Math.max(1, ...counts.flat());
      root.querySelector('[data-matrix]').innerHTML = `<table class="ll-table ll-matrix"><caption>${normalized ? 'Observed transition percentages within each row' : 'Adjacent transition counts'}<span>Rows = from · Columns = to</span></caption><thead><tr><th scope="col">From / to</th>${names.map(name => `<th scope="col">${name}</th>`).join('')}</tr></thead><tbody>${counts.map((row, i) => `<tr><th scope="row">${names[i]}</th>${row.map((count, j) => {
        const ratio = totals[i] ? count / totals[i] : 0;
        const shade = count === 0 ? 0 : Math.ceil(3 * (normalized ? ratio : count / maximum));
        const label = normalized ? (totals[i] ? `${(100 * ratio).toFixed(1)}%` : '–') : String(count);
        return `<td class="ll-heat-${shade}"><span aria-hidden="true">${label}</span><span class="ll-sr-only">${names[i]} to ${names[j]}: ${normalized ? (totals[i] ? `${label}, ${count} of ${totals[i]} outgoing transitions` : 'undefined, no outgoing transitions') : `${count} transitions`}</span></td>`;
      }).join('')}</tr>`).join('')}</tbody></table>`;
      root.querySelector('[data-matrix-note]').textContent = normalized ? 'Each cell is its count divided by all outgoing transitions in that row. A dash means no outgoing transitions, not 0%. Rounding may make a row total differ slightly from 100%.' : 'Every adjacent pair contributes one count. A darker cell indicates a larger count relative to the largest cell in this sequence.';
      root.querySelector('[data-total]').textContent = `${events.length} events · ${Math.max(0, events.length - 1)} adjacent transitions`;
      root.querySelector('[data-event-count]').textContent = `${events.length} / 20 events`;
      root.querySelectorAll('[data-add]').forEach(button => { button.disabled = events.length >= 20; });
      if (announce) root.querySelector('[data-status]').textContent = `${announce} ${events.length} events, ${Math.max(0, events.length - 1)} transitions. Matrix updated.`;
    }
    listen(root, 'change', event => {
      if (event.target.hasAttribute('data-index')) {
        const i = Number(event.target.dataset.index);
        if (!names.includes(event.target.value) || !Number.isInteger(i) || i < 0 || i >= events.length) return;
        events[i] = event.target.value;
        root.querySelector(`[data-remove="${i}"]`).setAttribute('aria-label', `Remove event ${i + 1}: ${events[i]}`);
        drawMatrix(`Event ${i + 1} changed to ${events[i]}.`);
      } else if (event.target.hasAttribute('data-normalize')) {
        normalized = event.target.checked; drawMatrix(normalized ? 'Row percentages shown.' : 'Counts shown.');
      }
    });
    listen(root, 'click', event => {
      const button = event.target.closest('button');
      if (!button || !root.contains(button)) return;
      if (button.hasAttribute('data-add') && events.length < 20 && names.includes(button.dataset.add)) {
        events.push(button.dataset.add); drawEvents(); drawMatrix(`${button.dataset.add} appended.`);
        if (events.length === 20) root.querySelector(`#${id}-event-19`).focus();
      } else if (button.hasAttribute('data-remove')) {
        const i = Number(button.dataset.remove);
        events.splice(i, 1); drawEvents(); drawMatrix('Event removed.');
        const next = root.querySelector(`#${id}-event-${Math.min(i, events.length - 1)}`) || root.querySelector('[data-add]');
        next.focus();
      } else if (button.hasAttribute('data-reset')) {
        events = [...initial]; normalized = false;
        root.querySelector('[data-normalize]').checked = false;
        drawEvents(); drawMatrix('Original sequence and count view restored.');
      }
    });
    drawEvents(); drawMatrix();
  }

  window.LearningLabs = {
    render(container, type) {
      if (!container || typeof container.replaceChildren !== 'function') throw new TypeError('LearningLabs.render needs a DOM element.');
      const builders = { bayes, ecd, sequence };
      if (!Object.prototype.hasOwnProperty.call(builders, type)) throw new RangeError(`Unknown learning activity: ${type}`);
      if (mounted.has(container)) mounted.get(container)();
      const root = document.createElement('div');
      root.className = `learning-lab ll-${escapeHTML(type)}`;
      container.replaceChildren(root);
      const listeners = [];
      const listen = (target, event, callback) => { target.addEventListener(event, callback); listeners.push([target, event, callback]); };
      builders[type](root, `learning-lab-${++instance}`, listen);
      let disposed = false;
      const cleanup = () => {
        if (disposed) return;
        disposed = true;
        listeners.forEach(([target, event, callback]) => target.removeEventListener(event, callback));
        root.remove();
        if (mounted.get(container) === cleanup) mounted.delete(container);
      };
      mounted.set(container, cleanup);
      return cleanup;
    }
  };
})();
