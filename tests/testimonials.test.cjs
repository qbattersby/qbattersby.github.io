const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const script = fs.readFileSync(path.join(__dirname, '../js/testimonials.js'), 'utf8');

function harness({ random = 0, missingControl = false } = {}) {
  const makeNode = (attributes = {}) => {
    const classes = new Set();
    const listeners = {};
    return {
      attributes, classes, listeners, hidden: true, textContent: '',
      classList: {
        add: (name) => classes.add(name),
        toggle: (name, selected) => selected ? classes.add(name) : classes.delete(name)
      },
      getAttribute: (name) => attributes[name],
      setAttribute: (name, value) => { attributes[name] = value; },
      removeAttribute: (name) => { delete attributes[name]; },
      addEventListener: (name, callback) => { listeners[name] = callback; }
    };
  };
  const slides = ['Sourov De', 'Kaleigh Bulford', 'Noah Jensen', 'Anne Marie Heinrichs'].map((name) => makeNode({ 'data-author': name }));
  const controls = makeNode();
  const previous = makeNode();
  const next = makeNode();
  const count = makeNode();
  const status = makeNode();
  const region = makeNode();
  region.querySelectorAll = () => slides;
  region.querySelector = (selector) => ({
    '[data-testimonial-controls]': controls,
    '[data-testimonial-previous]': previous,
    '[data-testimonial-next]': missingControl ? null : next,
    '[data-testimonial-count]': count,
    '[data-testimonial-status]': status
  })[selector];
  const math = Object.create(Math);
  math.random = () => random;
  // No timer APIs are supplied: rotation must only happen through user input.
  vm.runInNewContext(script, { document: { querySelectorAll: () => [region] }, Math: math });
  return { slides, controls, previous, next, count, status, region };
}

test('initial quote varies without announcing unsolicited content', () => {
  const h = harness({ random: 0.6 });
  assert.equal(h.count.textContent, '3 / 4');
  assert.equal(h.status.textContent, '');
  assert.equal(h.controls.hidden, false);
  assert.equal(h.slides.filter((slide) => slide.classes.has('is-current')).length, 1);
  h.slides.forEach((slide, index) => {
    assert.equal(slide.attributes['aria-hidden'], index === 2 ? 'false' : 'true');
    assert.equal('inert' in slide.attributes, index !== 2);
  });
});

test('both controls wrap, announce the author, and keep inactive links inert', () => {
  const h = harness();
  h.previous.listeners.click();
  assert.equal(h.count.textContent, '4 / 4');
  assert.equal(h.status.textContent, 'Testimonial 4 of 4: Anne Marie Heinrichs.');
  assert.equal(h.slides[0].attributes.inert, '');
  assert.equal('inert' in h.slides[3].attributes, false);
  h.next.listeners.click();
  assert.equal(h.count.textContent, '1 / 4');
  assert.equal(h.status.textContent, 'Testimonial 1 of 4: Sourov De.');
  assert.equal('inert' in h.slides[0].attributes, false);
  assert.equal(h.slides[3].attributes.inert, '');
  h.next.listeners.click();
  assert.equal(h.status.textContent, 'Testimonial 2 of 4: Kaleigh Bulford.');
});

test('incomplete controls preserve the readable static fallback', () => {
  const h = harness({ missingControl: true });
  assert.equal(h.region.classes.has('testimonials-ready'), false);
  assert.equal(h.controls.hidden, true);
  assert.equal(h.slides.some((slide) => 'aria-hidden' in slide.attributes || 'inert' in slide.attributes), false);
});
