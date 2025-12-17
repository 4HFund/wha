(() => {
  const thankYouBase = new URL('thank-you.html', window.location.href);
  const primaryRecipients = ['sidney@wheelingwv-pha.org'];
  const replyToAddress = primaryRecipients[0];
  const ccRecipients = ['sidney.mozingo@gmail.com'];
  const officeEmail = primaryRecipients[0];
  const formsubmitBase = 'https://formsubmit.co/';
  const formsubmitDefaultEndpoint = `${formsubmitBase}${encodeURIComponent(officeEmail)}`;
  const debugMode = new URLSearchParams(window.location.search).get('debug') === 'true';

  const pageKey = document.body.dataset.page;
  const navLinks = document.querySelectorAll('[data-nav]');
  navLinks.forEach((link) => {
    if (link.dataset.nav === pageKey) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const backToTop = document.querySelector('[data-back-to-top]') || document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    const toggleBackToTop = () => {
      const show = window.scrollY > 260;
      backToTop.classList.toggle('show', show);
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop);
  }

  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  const filterInputs = document.querySelectorAll('[data-filter-list]');
  filterInputs.forEach((input) => {
    const listSelector = input.dataset.filterList;
    const items = document.querySelectorAll(`${listSelector} [data-filter-item]`);
    const emptyState = document.querySelector(input.dataset.emptyState || '');

    const applyFilter = () => {
      const term = input.value.trim().toLowerCase();
      let visibleCount = 0;
      items.forEach((item) => {
        const matches = item.textContent.toLowerCase().includes(term);
        item.style.display = matches ? '' : 'none';
        visibleCount += matches ? 1 : 0;
      });
      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    };

    input.addEventListener('input', applyFilter);
    applyFilter();
  });

  const formatRecipients = (values) => Array.from(values).map((entry) => entry.trim()).filter(Boolean).join(',');
  const parseList = (value = '') => value.split(',').map((entry) => entry.trim()).filter(Boolean);

  const ensureHiddenField = (form, name, defaultValue = '') => {
    const existing = form.querySelector(`input[name="${name}"]`);
    if (existing) {
      if (!existing.value && defaultValue) {
        existing.value = defaultValue;
      }
      return existing;
    }

    const field = document.createElement('input');
    field.type = 'hidden';
    field.name = name;
    field.value = defaultValue;
    form.appendChild(field);
    return field;
  };

  const ensureBotField = (form) => {
    const existing = form.querySelector('[data-bot-field]');
    if (existing) return existing;

    const wrapper = document.createElement('div');
    wrapper.dataset.botField = 'true';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = 'auto';
    wrapper.style.width = '1px';
    wrapper.style.height = '1px';
    wrapper.style.overflow = 'hidden';

    const label = document.createElement('label');
    label.textContent = 'Leave this field blank';
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'bot_field';
    input.tabIndex = -1;
    input.autocomplete = 'off';

    label.appendChild(input);
    wrapper.appendChild(label);
    form.appendChild(wrapper);
    return wrapper;
  };

  const syncPageField = (field) => {
    if (field) {
      field.value = window.location.href;
    }
  };

  const buildMailtoFallback = (formData, reason) => {
    const subject = formData.get('_subject') || 'Luau Manor form submission';
    const lines = [];
    if (reason) {
      lines.push(reason);
      lines.push('');
    }

    formData.forEach((value, key) => {
      if (key.startsWith('_')) return;
      if (value instanceof File) {
        if (value.name) {
          lines.push(`${key}: ${value.name} (${value.type || 'file'})`);
        }
        return;
      }
      lines.push(`${key}: ${value}`);
    });

    lines.push(`Page URL: ${window.location.href}`);

    const mailto = `mailto:${encodeURIComponent(officeEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    return mailto;
  };

  const ensureStatusRegion = (form) => {
    const existing = form.querySelector('[data-form-status]');
    if (existing) return existing;

    const status = document.createElement('div');
    status.dataset.formStatus = 'true';
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    form.appendChild(status);
    return status;
  };

  const updateStatus = (statusEl, message, type = 'info') => {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.classList.remove('is-error', 'is-success', 'is-info');
    if (type === 'error') {
      statusEl.classList.add('is-error');
    } else if (type === 'success') {
      statusEl.classList.add('is-success');
    } else {
      statusEl.classList.add('is-info');
    }
  };

  const setSubmittingState = (form, isSubmitting) => {
    const submitButton = form.querySelector('[type="submit"]');
    submitButton?.classList.toggle('is-busy', isSubmitting);
    if (isSubmitting) {
      submitButton?.setAttribute('aria-busy', 'true');
      submitButton?.setAttribute('disabled', 'true');
    } else {
      submitButton?.removeAttribute('aria-busy');
      submitButton?.removeAttribute('disabled');
    }
  };

  const reliableSubmit = (form, statusEl) => {
    if (form.dataset.reliableSubmit === 'true') return;
    form.dataset.reliableSubmit = 'true';

    form.addEventListener('submit', async (event) => {
      const pageField = form.querySelector('input[name="Page URL"]');
      syncPageField(pageField);

      if (!debugMode) {
        return;
      }

      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      setSubmittingState(form, true);
      statusEl && updateStatus(statusEl, 'Sending your form…', 'info');

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        });
        const responseText = await response.text();

        console.log('[FormSubmit]', form.dataset.formSource || 'form', 'status:', response.status, 'body:', responseText);

        if (!response.ok) {
          throw new Error(`FormSubmit returned ${response.status}`);
        }

        updateStatus(statusEl, 'Sent! We are redirecting you to the confirmation page.', 'success');
        const nextUrl = form.querySelector('input[name="_next"]')?.value;
        if (nextUrl) {
          window.location.href = nextUrl;
        }
      } catch (error) {
        console.error('[FormSubmit] submission failed', error);
        updateStatus(statusEl, 'We could not send automatically. Opening an email draft now.', 'error');
        alert('We could not send the form automatically. We will open an email draft to sidney@wheelingwv-pha.org with your details.');
        window.location.href = buildMailtoFallback(formData, 'Automatic FormSubmit delivery failed. Please send this email.');
      } finally {
        setSubmittingState(form, false);
      }
    });
  };

  document.querySelectorAll('form[action^="https://formsubmit.co"]').forEach((form) => {
    const formName = (form.dataset.formSource || 'form').replace(/[-_]+/g, ' ');
    const readableName = formName.replace(/\b\w/g, (letter) => letter.toUpperCase());

    if ((form.getAttribute('method') || '').toUpperCase() !== 'POST') {
      console.warn('[FormSubmit] Form missing method="POST"; defaulting to POST for compatibility.', {
        source: form.dataset.formSource || 'form',
      });
      form.setAttribute('method', 'POST');
    }

    if (!form.action || form.action === formsubmitBase || form.action.endsWith('/')) {
      form.action = formsubmitDefaultEndpoint;
    }

    const redirectField = ensureHiddenField(form, '_next');
    const redirectUrl = new URL(thankYouBase);
    redirectUrl.searchParams.set('from', form.dataset.formSource || 'form');
    redirectField.value = redirectUrl.href;

    ensureHiddenField(form, '_subject', `Luau Manor - ${readableName}`);
    ensureHiddenField(form, '_template', 'table');
    ensureHiddenField(form, '_captcha', 'false');
    ensureHiddenField(form, '_honey', '');
    ensureBotField(form);

    const pageField = ensureHiddenField(form, 'Page URL', window.location.href);
    pageField.dataset.capturePage = 'true';

    const toField = ensureHiddenField(form, '_to', formatRecipients(primaryRecipients));
    const toSeed = new Set([...primaryRecipients, ...parseList(toField.value)]);
    toField.value = formatRecipients(toSeed);

    const ccField = ensureHiddenField(form, '_cc');
    const ccDefaultSeed = new Set([
      ...primaryRecipients,
      ...ccRecipients,
      ...parseList(ccField.value),
      ...parseList(ccField.dataset.defaultCc || ''),
    ]);
    ccField.dataset.defaultCc = formatRecipients(ccDefaultSeed);

    const bccField = ensureHiddenField(form, '_bcc', formatRecipients(ccRecipients));
    const bccSeed = new Set([...ccRecipients, ...parseList(bccField.value)]);
    bccField.value = formatRecipients(bccSeed);

    const replyToField = ensureHiddenField(form, '_replyto', replyToAddress);
    const formEmail = form.querySelector('input[type="email"]');

    const syncEmails = () => {
      const emailValue = (formEmail && formEmail.value) ? formEmail.value.trim() : '';
      const defaultCc = parseList(ccField.dataset.defaultCc || '');
      const ccValues = new Set([...defaultCc]);

      if (emailValue) {
        ccValues.add(emailValue);
        replyToField.value = emailValue;
      } else {
        replyToField.value = replyToAddress;
      }

      ccField.value = formatRecipients(ccValues);
    };

    formEmail && formEmail.addEventListener('input', syncEmails);
    syncEmails();
    syncPageField(pageField);
    const statusEl = ensureStatusRegion(form);
    reliableSubmit(form, statusEl);
  });
})();
