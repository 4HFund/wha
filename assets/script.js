(function () {
  const searchInput = document.getElementById('quick-search');
  const cards = Array.from(document.querySelectorAll('[data-search-grid] .card'));
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const backToTop = document.querySelector('.back-to-top');
  const forms = Array.from(document.querySelectorAll('form[action^="https://formsubmit.co"]'));

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

  if (forms.length) {
    const thankYouBase = new URL('thank-you.html', window.location.href);

    forms.forEach((form) => {
      const formSource = form.dataset.formSource || 'form';
      const nextField =
        form.querySelector('input[name="_next"]') ||
        form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: '_next' }));
      const status = document.createElement('p');

      status.className = 'microcopy form-status';
      status.setAttribute('role', 'status');
      status.textContent = '';

      const statusInsertAfter = form.querySelector('.cta-row');
      if (statusInsertAfter && statusInsertAfter.parentNode) {
        statusInsertAfter.parentNode.insertBefore(status, statusInsertAfter);
      } else {
        form.appendChild(status);
      }

      const nextUrl = new URL(thankYouBase);
      nextUrl.searchParams.set('from', formSource);
      nextField.value = nextUrl.toString();

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const ajaxUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
        const formData = new FormData(form);

        status.textContent = 'Sending… please wait a moment while we submit your form.';

        try {
          const response = await fetch(ajaxUrl, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });

          if (!response.ok) {
            throw new Error(`Form submission failed with status ${response.status}`);
          }

          const payload = await response.json();

          if (payload.success) {
            window.location.href = nextField.value;
            return;
          }

          throw new Error(payload.message || 'Unknown submission error');
        } catch (error) {
          status.textContent =
            'We could not submit the form online. Please call (304) 215-2584 or email sidney@wheelingwv-pha.org to report this.';
          console.error(error);
        }
      });
    });
  }
})();
