const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '../js/project-highlights.js'), 'utf8');

function card(id, type) {
    return { dataset: { highlightProject: id, highlightType: type } };
}

function pool() {
    return [
        ...['nithview', 'heritage', 'sms', 'wildfire'].map((id) => card(id, 'design-development')),
        ...['wpl', 'desch', 'rwdi', 'riveron', 'rtpark'].map((id) => card(id, 'development'))
    ];
}

function harness({ cards = pool(), seed = 1, readyState = 'complete', noGrid = false } = {}) {
    let state = seed;
    let replacements = 0;
    let randomCalls = 0;
    const listeners = {};
    const grid = {
        dataset: {},
        children: cards.slice(),
        querySelectorAll(selector) {
            assert.equal(selector, ':scope > [data-highlight-project]');
            return this.children;
        },
        replaceChildren(...selected) {
            replacements += 1;
            this.children = selected;
        }
    };
    const document = {
        readyState,
        querySelectorAll(selector) {
            assert.equal(selector, '[data-project-highlights]');
            return noGrid ? [] : [grid];
        },
        addEventListener(name, callback) { listeners[name] = callback; }
    };
    const math = Object.create(Math);
    math.random = () => {
        randomCalls += 1;
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 4294967296;
    };
    const context = vm.createContext({ document, Math: math });
    const run = () => vm.runInContext(script, context);
    run();
    return {
        grid, run,
        ready: () => listeners.DOMContentLoaded(),
        replacements: () => replacements,
        randomCalls: () => randomCalls
    };
}

test('every selection contains one design project and two distinct development projects', () => {
    const seen = new Set();
    for (let seed = 1; seed <= 200; seed += 1) {
        const h = harness({ seed });
        const chosen = h.grid.children;
        assert.equal(chosen.length, 3);
        assert.equal(new Set(chosen.map((item) => item.dataset.highlightProject)).size, 3);
        assert.equal(chosen.filter((item) => item.dataset.highlightType === 'design-development').length, 1);
        assert.equal(chosen.filter((item) => item.dataset.highlightType === 'development').length, 2);
        chosen.forEach((item) => seen.add(item.dataset.highlightProject));
    }
    assert.equal(seen.size, 9, 'Every curated project can appear in the highlights.');
});

test('source cards stay available until DOM readiness and selected nodes are reused', () => {
    const cards = pool();
    const h = harness({ cards, readyState: 'loading' });
    assert.equal(h.grid.children.length, 9);
    assert.equal(h.replacements(), 0);
    h.ready();
    assert.equal(h.grid.children.length, 3);
    assert.equal(h.replacements(), 1);
    assert.ok(h.grid.children.every((item) => cards.includes(item)));
});

test('reinitialization leaves the current selection in place without rerolling', () => {
    const h = harness();
    const firstSelection = h.grid.children;
    const randomCalls = h.randomCalls();
    h.run();
    assert.equal(h.grid.children, firstSelection);
    assert.equal(h.replacements(), 1);
    assert.equal(h.randomCalls(), randomCalls);
});

test('duplicate project entries cannot occupy two highlights', () => {
    const cards = pool();
    cards.push(card('wpl', 'development'), card('sms', 'design-development'));
    const h = harness({ cards });
    assert.equal(h.grid.children.length, 3);
    assert.equal(new Set(h.grid.children.map((item) => item.dataset.highlightProject)).size, 3);
});

test('smaller or missing pools use available distinct projects without empty slots', () => {
    for (const cards of [
        pool().filter((item) => item.dataset.highlightType === 'design-development'),
        pool().filter((item) => item.dataset.highlightType === 'development'),
        pool().slice(0, 2),
        [card('design', 'design-development'), card('development', 'development')]
    ]) {
        const h = harness({ cards });
        assert.equal(h.grid.children.length, Math.min(cards.length, 3));
        assert.equal(new Set(h.grid.children).size, h.grid.children.length);
    }
});

test('pages without highlights and empty or unrecognized pools are left untouched', () => {
    assert.equal(harness({ noGrid: true }).replacements(), 0);
    assert.equal(harness({ cards: [] }).replacements(), 0);
    const h = harness({ cards: [card('other', 'unknown')] });
    assert.equal(h.replacements(), 0);
    assert.equal(h.grid.children.length, 1);
});
