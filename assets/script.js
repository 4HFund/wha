(function () {
  const searchInput = document.getElementById('quick-search');
  const cards = Array.from(document.querySelectorAll('[data-search-grid] .card'));
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const backToTop = document.querySelector('.back-to-top');
  const thankYouBase = new URL('thank-you.html', window.location.href);
  const officeEmail = 'sidney@wheelingwv-pha.org';

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
      autoresponseField.value = `Thank you for contacting the Luau Manor office. We received your ${formName} and will respond within one business day.`;
    }

    const replyToField = form.querySelector('input[name="_replyto"]')
      || form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_replyto' }));
    const formEmail = form.querySelector('input[type="email"]');
    const syncReplyTo = () => {
      replyToField.value = (formEmail && formEmail.value) ? formEmail.value : officeEmail;
    };
    formEmail && formEmail.addEventListener('input', syncReplyTo);
    syncReplyTo();

    if (!form.querySelector('input[name="_captcha"]')) {
      form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_captcha', value: 'false' }));
    }
  });
})();
