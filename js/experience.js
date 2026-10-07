(function () {
    'use strict';

    function updateExperience(doc, year) {
        if (!Number.isInteger(year)) return;
        doc.querySelectorAll('[data-experience-start]').forEach(function (element) {
            var start = Number(element.getAttribute('data-experience-start'));
            var template = element.getAttribute('data-experience-template');
            // Leave the timeless HTML fallback when the inputs are incomplete.
            if (!Number.isInteger(start) || start < 1900 || start > year || !template || !template.includes('{years}')) return;
            element.textContent = template.replace(/\{years\}/g, String(year - start));
        });
    }

    if (typeof module === 'object' && module.exports) {
        module.exports = updateExperience;
    } else {
        updateExperience(document, new Date().getFullYear());
    }
}());
