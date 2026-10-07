(function () {
  'use strict';

  var productionHosts = ['qbattersby.com', 'www.qbattersby.com'];
  var isProduction = productionHosts.indexOf(window.location.hostname.toLowerCase()) !== -1;
  var allowedContexts = [
    'generic',
    'business-website',
    'agency-development',
    'wordpress-support',
    'figma-development',
    'kitchener-waterloo',
    'norfolk-county'
  ];
  var enquiryContext = 'generic';

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest && event.target.closest('[data-open="contactForm"], [data-enquiry-context]');
    if (!trigger) return;
    var context = trigger.getAttribute('data-enquiry-context');
    enquiryContext = allowedContexts.indexOf(context) !== -1 ? context : 'generic';
  }, true);

  function confirmLead(context) {
    var navigating = false;
    var fallback;
    var finish = function () {
      if (navigating) return;
      navigating = true;
      window.clearTimeout(fallback);
      window.location.assign('/thank-you.html');
    };

    // Let an existing GTM tag finish, while still navigating if it is absent or blocked.
    fallback = window.setTimeout(finish, 1500);
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'generate_lead',
        contact_method: 'form',
        enquiry_context: context,
        eventCallback: finish,
        eventTimeout: 1500
      });
    } catch (error) {
      finish();
    }
  }

  async function sendEnquiry(payload) {
    var controller = window.AbortController ? new window.AbortController() : null;
    var timeout;
    try {
      var deadline = new Promise(function (resolve, reject) {
        timeout = window.setTimeout(function () {
          reject(new Error('Submission timed out'));
          if (controller) controller.abort();
        }, 15000);
      });
      var request = window.fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      }).then(async function (response) {
        var result = await response.json();
        if (!response.ok || result.success !== true) throw new Error('Submission not confirmed');
      });
      // Bound both the request and response body; a late result cannot confirm a lead.
      await Promise.race([request, deadline]);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  document.querySelectorAll('[data-enquiry-form]').forEach(function (form) {
    if (form.dataset.enquiryBound) return;
    // Older production browsers retain the regular HTML submission as a fallback.
    if (isProduction && (!window.fetch || !window.FormData)) return;
    form.dataset.enquiryBound = 'true';

    var status = form.querySelector('[data-enquiry-status]');
    var submit = form.querySelector('[type="submit"]');
    var originalLabel = submit ? submit.textContent : '';
    var pending = false;
    var confirmed = false;

    function showStatus(message, state) {
      if (!status) return;
      status.textContent = message;
      status.dataset.state = state;
    }

    function setPending(value) {
      form.setAttribute('aria-busy', String(value));
      if (submit) {
        submit.disabled = value;
        submit.textContent = value ? 'Sending…' : originalLabel;
      }
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (pending || confirmed) return;
      if (!form.reportValidity()) return;

      // Local previews must never send an email or record a lead.
      if (!isProduction) {
        showStatus('This is the local preview. Your message has not been sent.', 'preview');
        return;
      }

      pending = true;
      setPending(true);
      showStatus('Sending your message…', 'pending');
      var submittedContext = enquiryContext;

      try {
        var payload = Object.fromEntries(new window.FormData(form));
        // Web3Forms redirects belong to the non-JavaScript fallback only.
        delete payload.redirect;
        await sendEnquiry(payload);
        confirmed = true;
      } catch (error) {
        showStatus('I couldn’t confirm that your message was sent. Your details are still here. Please try again, or email quinn@battersby.ca.', 'error');
      } finally {
        if (!confirmed) {
          pending = false;
          setPending(false);
        }
      }

      if (confirmed) {
        showStatus('Thanks. Your message has been sent.', 'success');
        if (submit) submit.textContent = 'Message sent';
        // No names, email addresses, notes or other form fields enter analytics.
        confirmLead(submittedContext);
      }
    });
  });
}());
