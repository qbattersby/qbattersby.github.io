(function () {
    'use strict';

    function shuffle(items) {
        const result = items.slice();
        for (let i = result.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    function initHighlights() {
        document.querySelectorAll('[data-project-highlights]').forEach((grid) => {
            if (grid.dataset.highlightsReady === 'true') return;

            const unique = new Map();
            grid.querySelectorAll(':scope > [data-highlight-project]').forEach((card) => {
                const id = card.dataset.highlightProject;
                const type = card.dataset.highlightType;
                if (id && !unique.has(id) && ['design-development', 'development'].includes(type)) {
                    unique.set(id, card);
                }
            });
            const cards = Array.from(unique.values());
            if (!cards.length) return;

            const design = shuffle(cards.filter((card) => card.dataset.highlightType === 'design-development'));
            const development = shuffle(cards.filter((card) => card.dataset.highlightType === 'development'));
            const selected = [...design.slice(0, 1), ...development.slice(0, 2)];

            // Preserve three distinct projects if one of the pools gets smaller later.
            const remaining = shuffle(cards.filter((card) => !selected.includes(card)));
            selected.push(...remaining.slice(0, Math.max(0, 3 - selected.length)));

            // The complete set remains in the HTML source and is visible without JS.
            // Choose once on load; nothing rotates or moves while someone reads it.
            grid.replaceChildren(...selected);
            grid.dataset.highlightsReady = 'true';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHighlights, { once: true });
    } else {
        initHighlights();
    }
}());
