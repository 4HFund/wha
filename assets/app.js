(() => {
  const thankYouBase = new URL('thank-you.html', window.location.href);
  const officeRecipients = ['sidney@wheelingwv-pha.org'];
  const ccDefaults = ['sidney.mozingo@gmail.com'];
  const bccDefaults = [...officeRecipients];
  const officeEmail = officeRecipients[0];
  const formsubmitBase = 'https://formsubmit.co/';
  const formsubmitDefaultEndpoint = `${formsubmitBase}${encodeURIComponent(officeEmail)}`;

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

  document.querySelectorAll('form[action^="https://formsubmit.co"]').forEach((form) => {
    const formName = (form.dataset.formSource || 'form').replace(/[-_]+/g, ' ');
    const readableName = formName.replace(/\b\w/g, (letter) => letter.toUpperCase());

    if (!form.action || form.action === formsubmitBase || form.action.endsWith('/')) {
      form.action = formsubmitDefaultEndpoint;
    }

    const redirectField = ensureHiddenField(form, '_next');
    const redirectUrl = new URL(thankYouBase);
    redirectUrl.searchParams.set('from', form.dataset.formSource || 'form');
    redirectField.value = redirectUrl.toString();

    ensureHiddenField(form, '_subject', `Luau Manor - ${readableName}`);
    ensureHiddenField(form, '_template', 'table');
    ensureHiddenField(form, '_captcha', 'false');

    const ccField = ensureHiddenField(form, '_cc', formatRecipients([...officeRecipients, ...ccDefaults]));
    ensureHiddenField(form, '_bcc', formatRecipients(bccDefaults));

    const ccSeed = new Set([
      ...officeRecipients,
      ...ccDefaults,
      ...ccField.value.split(',').map((entry) => entry.trim()).filter(Boolean),
      ...((ccField.dataset.defaultCc || '').split(',').map((entry) => entry.trim()).filter(Boolean)),
    ]);

    ccField.value = formatRecipients(ccSeed);
    ccField.dataset.defaultCc = ccField.dataset.defaultCc || ccField.value;

    const replyToField = ensureHiddenField(form, '_replyto');
    const formEmail = form.querySelector('input[type="email"]');

    const syncEmails = () => {
      const emailValue = (formEmail && formEmail.value) ? formEmail.value.trim() : '';
      const defaultCc = (ccField.dataset.defaultCc || '').split(',').map((entry) => entry.trim()).filter(Boolean);
      const ccValues = new Set([...officeRecipients, ...ccDefaults, ...defaultCc]);

      replyToField.value = emailValue;

      if (emailValue) {
        ccValues.add(emailValue);
      }

      ccField.value = formatRecipients(ccValues);
    };

    formEmail && formEmail.addEventListener('input', syncEmails);
    syncEmails();
  });
})();
