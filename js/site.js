(function () {
    'use strict';

    if (window.jQuery && window.jQuery.fn.foundation) {
        window.jQuery(document).foundation();
    }

    // Intent is separate from a confirmed enquiry. Never include contact details.
    document.addEventListener('click', function (event) {
        var trigger = event.target.closest && event.target.closest('[data-open="contactForm"], a[href^="mailto:"], a[href^="tel:"]');
        if (!trigger || !['qbattersby.com', 'www.qbattersby.com'].includes(window.location.hostname)) return;

        var method = trigger.hasAttribute('data-open') ? 'form' : (trigger.getAttribute('href').startsWith('mailto:') ? 'email' : 'phone');
        var contexts = ['generic', 'business-website', 'agency-development', 'wordpress-support', 'figma-development', 'kitchener-waterloo', 'norfolk-county'];
        var context = trigger.getAttribute('data-enquiry-context');
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'contact_intent',
            contact_method: method,
            enquiry_context: contexts.includes(context) ? context : 'generic'
        });
    });
}());
