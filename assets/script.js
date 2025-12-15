(function () {
  const searchInput = document.getElementById('quick-search');
  const cards = Array.from(document.querySelectorAll('[data-search-grid] .card'));
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const backToTop = document.querySelector('.back-to-top');
  const thankYouBase = new URL('thank-you.html', window.location.href);
  const officeEmail = 'sidney@wheelingwv-pha.org';
  const officePhone = '(304) 215-2584';

  function filterCards(value) {
    const term = value.toLowerCase().trim();
    cards.forEach((card) => {
      const matches = card.dataset.keywords.toLowerCase().includes(term) || card.textContent.toLowerCase().includes(term);
      card.style.display = matches ? 'grid' : 'none';
    });
  }

  if (searchInput && cards.length) {
    searchInput.addEventListener('input', (event) => {
      filterCards(event.target.value);
    });
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a, summary').forEach((link) => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      const shouldShow = window.scrollY > 240;
      backToTop.classList.toggle('show', shouldShow);
    });
  }

  document.querySelectorAll('form[action^="https://formsubmit.co"]').forEach((form) => {
    const formName = (form.dataset.formSource || 'form').replace(/[-_]+/g, ' ');
    const readableName = formName.replace(/\b\w/g, (letter) => letter.toUpperCase());

    const buildAjaxAction = (action) => {
      try {
        const url = new URL(action);
        const trimmedPath = url.pathname.replace(/^\/+|\/+$/g, '');
        const emailPath = trimmedPath.split('/').pop();
        return `${url.origin}/ajax/${emailPath}`;
      } catch (error) {
        console.warn('Unable to build ajax form action for', action, error);
        return action;
      }
    };

    const ajaxAction = buildAjaxAction(form.action);

    const nextField = form.querySelector('input[name="_next"]')
      || form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_next' }));
    const nextUrl = new URL(thankYouBase);
    nextUrl.searchParams.set('from', form.dataset.formSource || 'form');
    nextField.value = nextUrl.toString();

    const subjectField = form.querySelector('input[name="_subject"]')
      || form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_subject' }));
    if (!subjectField.value) {
      subjectField.value = `Luau Manor - ${readableName} submission`;
    }

    const templateField = form.querySelector('input[name="_template"]')
      || form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_template' }));
    if (!templateField.value) {
      templateField.value = 'table';
    }

    const autoresponseField = form.querySelector('input[name="_autoresponse"]')
      || form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_autoresponse' }));
    if (!autoresponseField.value) {
      autoresponseField.value = `Thank you for contacting the Luau Manor office. We received your ${formName} and will respond within one business day. This confirmation includes a copy of what you submitted.`;
    }

    const toField = form.querySelector('input[name="_to"]')
      || form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_to' }));
    toField.value = officeEmail;

    const replyToField = form.querySelector('input[name="_replyto"]')
      || form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_replyto' }));
    const baseCc = officeEmail;
    let ccField = form.querySelector('input[name="_cc"]');
    const formEmail = form.querySelector('input[type="email"]');
    const syncReplyTo = () => {
      const emailValue = (formEmail && formEmail.value) ? formEmail.value.trim() : '';
      replyToField.value = emailValue || officeEmail;

      ccField = ccField || form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_cc' }));
      ccField.value = emailValue ? `${baseCc}, ${emailValue}` : baseCc;
    };
    formEmail && formEmail.addEventListener('input', syncReplyTo);
    syncReplyTo();

    if (!form.querySelector('input[name="_captcha"]')) {
      form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_captcha', value: 'false' }));
    }

    const statusRegion = form.querySelector('[data-form-status]') || (() => {
      const region = document.createElement('div');
      region.className = 'form-status';
      region.setAttribute('data-form-status', 'true');
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      form.insertBefore(region, form.firstChild);
      return region;
    })();

    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      statusRegion.classList.remove('error');
      statusRegion.textContent = 'Sending your request…';
      submitButton?.setAttribute('disabled', 'true');

      try {
        const response = await fetch(ajaxAction, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });

        if (!response.ok) {
          throw new Error(response.statusText || 'Network error');
        }

        const redirectUrl = form.querySelector('input[name="_next"]')?.value || thankYouBase.toString();
        statusRegion.textContent = 'Sent! Redirecting to the confirmation page…';
        window.location.href = redirectUrl;
      } catch (error) {
        statusRegion.classList.add('error');
        statusRegion.innerHTML = `We could not reach the server. Please call <a href="tel:${officePhone.replace(/[^0-9]/g, '')}">${officePhone}</a> or email <a href="mailto:${officeEmail}">${officeEmail}</a> while we fix this.`;
        console.error('Form submission failed:', error);
      } finally {
        submitButton?.removeAttribute('disabled');
      }
    });
  });
})();
