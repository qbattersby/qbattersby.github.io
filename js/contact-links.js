(function () {
    function updateEmailLinks() {
        document.querySelectorAll('a[data-email-user][data-email-domain]').forEach(function (link) {
            var user = link.getAttribute('data-email-user');
            var domain = link.getAttribute('data-email-domain');
            var subject = link.getAttribute('data-email-subject');

            if (!user || !domain) {
                return;
            }

            var email = user + '@' + domain;
            var href = 'mailto:' + email;

            if (subject) {
                href += '?subject=' + encodeURIComponent(subject);
            }

            link.setAttribute('href', href);

            if (!link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', 'Email Quinn Battersby');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateEmailLinks);
    } else {
        updateEmailLinks();
    }
}());
