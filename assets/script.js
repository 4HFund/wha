(function () {
  const searchInput = document.getElementById('quick-search');
  const cards = Array.from(document.querySelectorAll('[data-search-grid] .card'));
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const backToTop = document.querySelector('.back-to-top');
  const thankYouBase = new URL('thank-you.html', window.location.href);
  const officeRecipients = ['sidney@wheelingwv-pha.org'];
  const ccDefaults = ['sidney.mozingo@gmail.com'];
  const officeEmail = officeRecipients[0];
  const officePhone = '(304) 215-2584';
  const formsubmitBase = 'https://formsubmit.co/';
  const formsubmitDefaultEndpoint = `${formsubmitBase}${encodeURIComponent(officeEmail)}`;

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

    mainNav.querySelectorAll('a').forEach((link) => {
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

    const ccField = ensureHiddenField(form, '_cc', ccDefaults.join(', '));
    if (!ccField.dataset.defaultCc) {
      ccField.dataset.defaultCc = ccField.value;
    }

    const replyToField = ensureHiddenField(form, '_replyto');
    const formEmail = form.querySelector('input[type="email"]');

    const syncEmails = () => {
      const emailValue = (formEmail && formEmail.value) ? formEmail.value.trim() : '';
      const defaultCc = (ccField.dataset.defaultCc || '').split(',').map((entry) => entry.trim()).filter(Boolean);
      const ccValues = new Set([...ccDefaults, ...defaultCc]);

      replyToField.value = emailValue;

      if (emailValue) {
        ccValues.add(emailValue);
      }

      ccField.value = Array.from(ccValues).join(', ');
    };

    formEmail && formEmail.addEventListener('input', syncEmails);
    syncEmails();
  });
})();
