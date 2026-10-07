const test = require('node:test');
const assert = require('node:assert/strict');
const updateExperience = require('../js/experience.js');

function element(start, template) {
    return {
        textContent: 'Building for the web since 2008',
        getAttribute(name) {
            return name === 'data-experience-start' ? start : template;
        }
    };
}
function documentWith(items) {
    return { querySelectorAll(selector) { assert.equal(selector, '[data-experience-start]'); return items; } };
}

test('experience advances from 2008 when the calendar year changes', () => {
    const badge = element('2008', '{years}+ years building for the web');
    const doc = documentWith([badge]);
    updateExperience(doc, 2026);
    assert.equal(badge.textContent, '18+ years building for the web');
    updateExperience(doc, 2027);
    assert.equal(badge.textContent, '19+ years building for the web');
});

test('inline experience wording uses text only', () => {
    const text = element('2008', 'over {years} years of experience');
    updateExperience(documentWith([text]), 2026);
    assert.equal(text.textContent, 'over 18 years of experience');
});

test('invalid or future dates and missing templates keep the source fallback', () => {
    const items = [element(null, '{years}'), element('invalid', '{years}'), element('2027', '{years}'), element('2008', null), element('2008', 'No placeholder')];
    updateExperience(documentWith(items), 2026);
    for (const item of items) assert.equal(item.textContent, 'Building for the web since 2008');
});
