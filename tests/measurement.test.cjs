const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const analyticsScript = fs.readFileSync(path.join(__dirname, '../js/analytics.js'), 'utf8');
const siteScript = fs.readFileSync(path.join(__dirname, '../js/site.js'), 'utf8');
const previewHosts = ['qbattersby.test', 'localhost', '127.0.0.1', 'preview.qbattersby.com', 'qbattersby.com.example.org'];
const productionHosts = ['qbattersby.com', 'www.qbattersby.com'];

// Capture script insertion and event queues without loading a vendor or making a request.
function harness({ hostname = 'qbattersby.com', pathname = '/', dataLayer } = {}) {
  const scripts = [];
  const listeners = new Map();
  const firstScript = {
    parentNode: {
      insertBefore(node, reference) {
        assert.equal(reference, firstScript);
        scripts.push(node);
      }
    }
  };
  const document = {
    location: { protocol: 'https:' },
    head: { appendChild: (node) => scripts.push(node) },
    createElement(tag) {
      assert.equal(tag, 'script');
      return { tagName: 'SCRIPT' };
    },
    getElementsByTagName(tag) {
      assert.equal(tag, 'script');
      return [firstScript];
    },
    addEventListener(name, handler) {
      const callbacks = listeners.get(name) || [];
      callbacks.push(handler);
      listeners.set(name, callbacks);
    }
  };
  const window = { location: { hostname, pathname } };
  if (dataLayer !== undefined) window.dataLayer = dataLayer;
  const context = vm.createContext({ window, document });

  return {
    window,
    scripts,
    analytics: () => vm.runInContext(analyticsScript, context, { filename: 'analytics.js' }),
    site: () => vm.runInContext(siteScript, context, { filename: 'site.js' }),
    click(attributes) {
      const trigger = attributes === null ? null : {
        hasAttribute: (name) => Object.hasOwn(attributes, name),
        getAttribute: (name) => attributes[name] ?? null
      };
      // A click on a child of a contact control resolves to its closest control.
      const target = { closest: () => trigger };
      for (const handler of listeners.get('click') || []) handler({ target });
    },
    clickNonElement() {
      for (const handler of listeners.get('click') || []) handler({ target: {} });
    }
  };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('analytics does not insert scripts or create queues on local and preview hosts', () => {
  for (const hostname of previewHosts) {
    for (const pathname of ['/', '/index.html', '/custom-wordpress-development/', '/thank-you.html']) {
      const h = harness({ hostname, pathname });
      h.analytics();
      assert.equal(h.scripts.length, 0, `${hostname}${pathname}`);
      assert.equal(h.window.dataLayer, undefined);
      assert.equal(h.window.mixpanel, undefined);
    }
  }
});

test('each production homepage loads the existing GTM and queues Mixpanel initialization once', () => {
  for (const hostname of productionHosts) {
    for (const pathname of ['/', '/index.html']) {
      const h = harness({ hostname, pathname });
      h.analytics();
      assert.deepEqual(h.scripts.map((script) => script.src), [
        'https://www.googletagmanager.com/gtm.js?id=GTM-T897BK',
        '//cdn.mxpnl.com/libs/mixpanel-2.2.min.js'
      ]);
      assert.ok(h.scripts.every((script) => script.async === true));
      assert.equal(h.window.dataLayer.length, 1);
      assert.equal(h.window.dataLayer[0].event, 'gtm.js');
      assert.ok(Number.isFinite(h.window.dataLayer[0]['gtm.start']));
      assert.equal(h.window.mixpanel._i.length, 1);
      assert.deepEqual(plain(h.window.mixpanel._i[0]), [
        'c92a5986631ed0a4b6c19404c128f2b0',
        { debug: false, track_pageview: true, persistence: 'localStorage' },
        'mixpanel'
      ]);
      assert.deepEqual(plain(Array.from(h.window.mixpanel)), [['track', 'Homepage Loaded']]);
    }
  }
});

test('production service and utility pages load GTM without homepage Mixpanel tracking', () => {
  for (const hostname of productionHosts) {
    for (const pathname of ['/custom-wordpress-development/', '/figma-to-wordpress/', '/wordpress-maintenance-support/', '/thank-you.html', '/404.html']) {
      const h = harness({ hostname, pathname });
      h.analytics();
      assert.deepEqual(h.scripts.map((script) => script.src), ['https://www.googletagmanager.com/gtm.js?id=GTM-T897BK']);
      assert.equal(h.window.dataLayer.length, 1);
      assert.equal(h.window.dataLayer[0].event, 'gtm.js');
      assert.equal(h.window.mixpanel, undefined);
    }
  }
});

test('analytics retains events already in the data layer', () => {
  const queue = [{ event: 'existing_event' }];
  const h = harness({ pathname: '/figma-to-wordpress/', dataLayer: queue });
  h.analytics();
  assert.equal(h.window.dataLayer, queue);
  assert.equal(queue.length, 2);
  assert.deepEqual(queue[0], { event: 'existing_event' });
  assert.equal(queue[1].event, 'gtm.js');
});

test('contact intent distinguishes form, email and phone on both production hosts', () => {
  for (const hostname of productionHosts) {
    const h = harness({ hostname });
    h.site();
    h.click({ 'data-open': 'contactForm', 'data-enquiry-context': 'business-website' });
    h.click({ href: 'mailto:quinn@battersby.ca', 'data-enquiry-context': 'figma-development' });
    h.click({ href: 'tel:+12263381659', 'data-enquiry-context': 'norfolk-county' });
    assert.deepEqual(plain(h.window.dataLayer), [
      { event: 'contact_intent', contact_method: 'form', enquiry_context: 'business-website' },
      { event: 'contact_intent', contact_method: 'email', enquiry_context: 'figma-development' },
      { event: 'contact_intent', contact_method: 'phone', enquiry_context: 'norfolk-county' }
    ]);
    assert.equal(h.scripts.length, 0);
  }
});

test('local and preview contact controls emit no analytics events', () => {
  for (const hostname of previewHosts) {
    const h = harness({ hostname });
    h.site();
    h.click({ 'data-open': 'contactForm', 'data-enquiry-context': 'business-website' });
    h.click({ href: 'mailto:quinn@battersby.ca' });
    h.click({ href: 'tel:+12263381659' });
    assert.equal(h.window.dataLayer, undefined, hostname);
    assert.equal(h.scripts.length, 0);
  }
});

test('unknown contexts and contact URLs cannot put personal details into intent events', () => {
  const h = harness();
  h.site();
  for (const context of [undefined, '', 'person@example.com', 'Private project notes', 'unexpected-context']) {
    h.click({ href: 'mailto:person@example.com?subject=Private%20project%20notes', 'data-enquiry-context': context });
    h.click({ href: 'tel:+15555551234', 'data-enquiry-context': context });
  }
  assert.equal(h.window.dataLayer.length, 10);
  for (const event of h.window.dataLayer) {
    assert.deepEqual(Object.keys(event).sort(), ['contact_method', 'enquiry_context', 'event']);
    assert.equal(event.event, 'contact_intent');
    assert.equal(event.enquiry_context, 'generic');
    assert.ok(['email', 'phone'].includes(event.contact_method));
  }
  const events = JSON.stringify(h.window.dataLayer);
  assert.doesNotMatch(events, /person@example|Private|15555551234|mailto:|tel:/);
  assert.doesNotMatch(events, /generate_lead/);
});

test('unrelated clicks and targets without closest do not create an intent event', () => {
  const h = harness();
  h.site();
  h.click(null);
  h.clickNonElement();
  assert.equal(h.window.dataLayer, undefined);
});

test('a contact click appends intent without replacing the analytics initialization', () => {
  const h = harness({ pathname: '/figma-to-wordpress/' });
  h.analytics();
  const queue = h.window.dataLayer;
  h.site();
  h.click({ 'data-open': 'contactForm', 'data-enquiry-context': 'agency-development' });
  assert.equal(h.window.dataLayer, queue);
  assert.deepEqual(queue.map((event) => event.event).join(','), 'gtm.js,contact_intent');
  assert.equal(h.scripts.length, 1);
});
