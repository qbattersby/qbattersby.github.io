(function () {
    'use strict';

    document.querySelectorAll('[data-testimonials]').forEach(function (region) {
        var slides = Array.from(region.querySelectorAll('[data-testimonial]'));
        var controls = region.querySelector('[data-testimonial-controls]');
        var previous = region.querySelector('[data-testimonial-previous]');
        var next = region.querySelector('[data-testimonial-next]');
        var count = region.querySelector('[data-testimonial-count]');
        var status = region.querySelector('[data-testimonial-status]');

        // Without complete controls, leave every quotation readable.
        if (slides.length < 2 || !controls || !previous || !next || !count || !status) return;

        var active = Math.floor(Math.random() * slides.length);

        function show(index, announce) {
            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                var selected = slideIndex === active;
                slide.classList.toggle('is-current', selected);
                slide.setAttribute('aria-hidden', selected ? 'false' : 'true');
                if (selected) {
                    slide.removeAttribute('inert');
                } else {
                    slide.setAttribute('inert', '');
                }
            });

            count.textContent = (active + 1) + ' / ' + slides.length;
            if (announce) {
                status.textContent = 'Testimonial ' + (active + 1) + ' of ' + slides.length + ': ' + slides[active].getAttribute('data-author') + '.';
            }
        }

        previous.addEventListener('click', function () { show(active - 1, true); });
        next.addEventListener('click', function () { show(active + 1, true); });
        show(active, false);
        region.classList.add('testimonials-ready');
        controls.hidden = false;
    });
}());
