const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const script = fs.readFileSync(path.join(__dirname, '../js/enquiry.js'), 'utf8');

function harness({ hostname = 'qbattersby.com', valid = true, fetchResponse } = {}) {
  const listeners = {};
  const documentListeners = {};
  const requests = [];
  const navigations = [];
  const timers = new Map();
  let nextTimer = 1;
  const status = { textContent: '', dataset: {} };
  const button = { textContent: 'Send message', disabled: false };
  const fields = {
    name: 'Test person', email: 'person@example.com', message: 'Private project notes',
    access_key: 'test-key', redirect: 'https://qbattersby.com/thank-you.html',
    project_type: 'A website', budget_range: '', ideal_timeline: ''
  };
  const attributes = {};
  const form = {
    dataset: {},
    reportValidity: () => valid,
    querySelector: (selector) => selector === '[type="submit"]' ? button : status,
    setAttribute: (name, value) => { attributes[name] = value; },
    addEventListener: (name, handler) => { listeners[name] = handler; }
  };
  const window = {
    location: { hostname, assign: (url) => navigations.push(url) },
    dataLayer: [],
    AbortController,
    FormData: class { constructor() { return Object.entries(fields); } },
    fetch: async (...args) => {
      requests.push(args);
      return fetchResponse ? fetchResponse(...args) : { ok: true, json: async () => ({ success: true }) };
    },
    setTimeout: (callback, delay) => { const id = nextTimer++; timers.set(id, { callback, delay }); return id; },
    clearTimeout: (id) => timers.delete(id)
  };
  const document = {
    querySelectorAll: () => [form],
    addEventListener: (name, handler) => { documentListeners[name] = handler; }
  };
  vm.runInNewContext(script, { window, document });
  return {
    window, requests, navigations, status, button, fields, attributes,
    submit: () => listeners.submit({ preventDefault() {} }),
    context: (value) => documentListeners.click({ target: { closest: () => ({ getAttribute: () => value }) } }),
    runTimers: (delay) => [...timers.entries()].forEach(([id, timer]) => {
      if (delay === undefined || timer.delay === delay) {
        timers.delete(id);
        timer.callback();
      }
    }),
    timerCount: (delay) => [...timers.values()].filter((timer) => timer.delay === delay).length
  };
}

test('invalid input does not submit or create a lead', async () => {
  const h = harness({ valid: false });
  await h.submit();
  assert.equal(h.requests.length, 0);
  assert.equal(h.window.dataLayer.length, 0);
  assert.equal(h.button.disabled, false);
});

test('every non-production hostname blocks network submission and leads', async () => {
  for (const hostname of ['qbattersby.test', 'localhost', '127.0.0.1', 'preview.qbattersby.com', 'qbattersby.com.example.org']) {
    const h = harness({ hostname });
    await h.submit();
    assert.equal(h.requests.length, 0, hostname);
    assert.equal(h.window.dataLayer.length, 0, hostname);
    assert.match(h.status.textContent, /local preview.*not been sent/);
    assert.equal(h.button.disabled, false);
  }
});

test('confirmed success posts JSON without redirect and sends only safe analytics fields', async () => {
  const h = harness({ hostname: 'www.qbattersby.com' });
  h.context('business-website');
  await h.submit();
  assert.equal(h.requests.length, 1);
  assert.equal(h.requests[0][0], 'https://api.web3forms.com/submit');
  const request = h.requests[0][1];
  assert.equal(request.method, 'POST');
  assert.equal(request.headers['Content-Type'], 'application/json');
  const payload = JSON.parse(request.body);
  assert.equal(payload.email, h.fields.email);
  assert.equal(payload.redirect, undefined);
  assert.equal(h.window.dataLayer.length, 1);
  const lead = h.window.dataLayer[0];
  assert.equal(lead.event, 'generate_lead');
  assert.equal(lead.contact_method, 'form');
  assert.equal(lead.enquiry_context, 'business-website');
  assert.deepEqual(Object.keys(lead).sort(), ['contact_method', 'enquiry_context', 'event', 'eventCallback', 'eventTimeout'].sort());
  assert.equal(h.button.disabled, true);
  lead.eventCallback();
  h.runTimers();
  assert.deepEqual(h.navigations, ['/thank-you.html']);
  await h.submit();
  assert.equal(h.requests.length, 1);
});

test('unknown or missing enquiry context cannot leak into analytics', async () => {
  for (const context of ['person@example.com?project=private', null]) {
    const h = harness();
    h.context(context);
    await h.submit();
    assert.equal(h.window.dataLayer[0].enquiry_context, 'generic');
    h.runTimers();
    assert.deepEqual(h.navigations, ['/thank-you.html']);
  }
});

test('software enquiries retain their service context without exposing project details', async () => {
  const h = harness();
  h.context('custom-software');
  h.fields.project_type = 'A custom business tool or SaaS product';
  await h.submit();
  assert.equal(h.window.dataLayer.length, 1);
  const lead = h.window.dataLayer[0];
  assert.equal(lead.enquiry_context, 'custom-software');
  assert.equal(lead.event, 'generate_lead');
  assert.doesNotMatch(JSON.stringify(lead), /Private project notes|person@example|SaaS/);
});

test('pending requests disable submission and prevent duplicate requests', async () => {
  let release;
  const response = new Promise((resolve) => { release = resolve; });
  const h = harness({ fetchResponse: () => response });
  const first = h.submit();
  assert.equal(h.button.disabled, true);
  assert.equal(h.attributes['aria-busy'], 'true');
  await h.submit();
  assert.equal(h.requests.length, 1);
  release({ ok: true, json: async () => ({ success: true }) });
  await first;
  assert.equal(h.window.dataLayer.length, 1);
});

test('HTTP errors, unsuccessful results, malformed JSON and network errors preserve input for retry', async () => {
  const failures = [
    async () => ({ ok: false, json: async () => ({ success: true }) }),
    async () => ({ ok: true, json: async () => ({ success: false }) }),
    async () => ({ ok: true, json: async () => ({ success: 'true' }) }),
    async () => ({ ok: true, json: async () => { throw new SyntaxError('Bad JSON'); } }),
    async () => { throw new Error('Offline'); }
  ];
  for (const failure of failures) {
    let attempts = 0;
    const h = harness({ fetchResponse: () => ++attempts === 1 ? failure() : { ok: true, json: async () => ({ success: true }) } });
    const original = { ...h.fields };
    await h.submit();
    assert.match(h.status.textContent, /couldn’t confirm/);
    assert.equal(h.button.disabled, false);
    assert.equal(h.button.textContent, 'Send message');
    assert.equal(h.attributes['aria-busy'], 'false');
    assert.deepEqual(h.fields, original);
    assert.equal(h.window.dataLayer.length, 0);
    assert.equal(h.navigations.length, 0);
    await h.submit();
    assert.equal(h.requests.length, 2);
    assert.equal(h.window.dataLayer.length, 1);
  }
});

test('a broken analytics integration does not prevent confirmed-success navigation', async () => {
  const h = harness();
  h.window.dataLayer.push = () => { throw new Error('Blocked analytics'); };
  await h.submit();
  assert.deepEqual(h.navigations, ['/thank-you.html']);
  assert.equal(h.status.dataset.state, 'success');
});

test('a 15-second timeout aborts a stalled request and permits a fresh retry', async () => {
  let attempts = 0;
  const h = harness({ fetchResponse: (url, options) => {
    if (++attempts > 1) return { ok: true, json: async () => ({ success: true }) };
    return new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new Error('Aborted')));
    });
  } });
  const original = { ...h.fields };
  const submission = h.submit();
  assert.equal(h.timerCount(15000), 1);
  assert.equal(h.button.disabled, true);
  h.runTimers(15000);
  await submission;
  assert.equal(h.requests[0][1].signal.aborted, true);
  assert.equal(h.button.disabled, false);
  assert.equal(h.attributes['aria-busy'], 'false');
  assert.match(h.status.textContent, /couldn’t confirm.*try again.*email/);
  assert.deepEqual(h.fields, original);
  assert.equal(h.window.dataLayer.length, 0);
  assert.equal(h.navigations.length, 0);
  await h.submit();
  assert.equal(h.requests.length, 2);
  assert.equal(h.requests[1][1].signal.aborted, false);
  assert.equal(h.window.dataLayer.length, 1);
  assert.equal(h.timerCount(15000), 0);
});

test('a response arriving after timeout cannot record a lead or interrupt a retry', async () => {
  let releaseOld;
  let releaseRetry;
  let attempts = 0;
  const h = harness({ fetchResponse: () => new Promise((resolve) => {
    if (++attempts === 1) releaseOld = resolve;
    else releaseRetry = resolve;
  }) });
  const first = h.submit();
  h.runTimers(15000);
  await first;
  const retry = h.submit();
  releaseOld({ ok: true, json: async () => ({ success: true }) });
  await new Promise(setImmediate);
  assert.equal(h.window.dataLayer.length, 0);
  assert.equal(h.navigations.length, 0);
  assert.equal(h.button.disabled, true);
  assert.equal(h.status.dataset.state, 'pending');
  releaseRetry({ ok: true, json: async () => ({ success: true }) });
  await retry;
  assert.equal(h.window.dataLayer.length, 1);
});

test('a stalled response body is bounded and its late success is ignored', async () => {
  let releaseBody;
  const h = harness({ fetchResponse: async () => ({
    ok: true,
    json: () => new Promise((resolve) => { releaseBody = resolve; })
  }) });
  const submission = h.submit();
  await new Promise(setImmediate);
  h.runTimers(15000);
  await submission;
  assert.equal(h.button.disabled, false);
  assert.equal(h.requests[0][1].signal.aborted, true);
  releaseBody({ success: true });
  await new Promise(setImmediate);
  assert.equal(h.window.dataLayer.length, 0);
  assert.equal(h.navigations.length, 0);
  assert.equal(h.status.dataset.state, 'error');
});

test('timeout recovery still works when AbortController is unavailable', async () => {
  const h = harness({ fetchResponse: () => new Promise(() => {}) });
  h.window.AbortController = undefined;
  const submission = h.submit();
  h.runTimers(15000);
  await submission;
  assert.equal(h.button.disabled, false);
  assert.equal(h.status.dataset.state, 'error');
  assert.equal(h.window.dataLayer.length, 0);
});
