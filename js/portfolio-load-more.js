document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('selected-work-grid');
    const button = document.querySelector('[data-load-more-work]');
    const status = document.querySelector('[data-load-more-status]');

    if (!grid || !button) {
        return;
    }

    const items = Array.from(grid.querySelectorAll(':scope > .cell'));
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
            button.hidden = true;
        }
    });
});
