document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('selected-work-grid');
    const button = document.querySelector('[data-load-more-work]');
    const status = document.querySelector('[data-load-more-status]');

    if (!grid || !button) {
        return;
    }

    const items = Array.from(grid.querySelectorAll(':scope > .cell'));
    // Shuffle once before choosing the first batch; subsequent loads keep this order.
    for (let i = items.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    const shuffledItems = document.createDocumentFragment();
    items.forEach((item) => shuffledItems.appendChild(item));
    grid.appendChild(shuffledItems);
    const batchSize = 6;
    let visibleCount = batchSize;

    if (items.length <= batchSize) {
        button.parentElement.hidden = true;
        return;
    }

    button.addEventListener('click', () => {
        const nextItems = items.slice(visibleCount, visibleCount + batchSize);

        nextItems.forEach((item) => {
            item.classList.add('is-visible');
        });

        visibleCount += nextItems.length;
        const remainingCount = items.length - visibleCount;

        if (status) {
            status.textContent = remainingCount
                ? `${nextItems.length} more projects shown. ${remainingCount} remaining.`
                : `${nextItems.length} more projects shown. All projects are now visible.`;
        }

        if (!remainingCount) {
            button.setAttribute('aria-expanded', 'true');
            if (document.activeElement === button && nextItems.length) {
                const heading = nextItems[0].querySelector('h4');
                if (heading) {
                    heading.tabIndex = -1;
                    heading.focus({ preventScroll: true });
                }
            }
            button.hidden = true;
        }
    });
});
