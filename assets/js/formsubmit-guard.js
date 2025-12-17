(() => {
  const formKey = (form) => {
    try {
      return form.action || form.getAttribute('action') || '';
    } catch (error) {
      console.warn('[FormSubmit Guard] Unable to read form action.', error);
      return '';
    }
  };

  const normalizeMethod = (value) => (value || '').toString().toUpperCase();

  document.addEventListener('DOMContentLoaded', () => {
    const forms = Array.from(document.querySelectorAll('form[action*="formsubmit.co"]'));
    const actionToForm = new Map();

    const recordForm = (form) => {
      const key = formKey(form);
      if (key) {
        actionToForm.set(key, form);
      }
    };

    const enforcePost = (form) => {
      const currentMethod = normalizeMethod(form.getAttribute('method'));
      if (currentMethod !== 'POST') {
        console.warn('[FormSubmit Guard] method corrected to POST', {
          path: window.location.pathname,
          action: formKey(form),
          previousMethod: currentMethod || 'GET (default)',
        });
        form.setAttribute('method', 'POST');
      }
    };

    forms.forEach((form) => {
      enforcePost(form);
      recordForm(form);

      const nestedParent = form.parentElement?.closest('form');
      if (nestedParent) {
        console.warn('[FormSubmit Guard] Nested form detected. Blocking outer submission to protect FormSubmit POST.', {
          path: window.location.pathname,
          childAction: formKey(form),
          parentAction: formKey(nestedParent),
        });
        nestedParent.addEventListener('submit', (event) => {
          event.preventDefault();
        });
      }

      form.addEventListener('submit', () => {
        enforcePost(form);
        recordForm(form);
        console.log('[FormSubmit Guard] submitting', {
          path: window.location.pathname,
          action: formKey(form),
          method: normalizeMethod(form.getAttribute('method')) || 'POST',
        });
      });
    });

    const fallbackForm = forms[0];
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init = {}) => {
      const url = typeof input === 'string' ? input : (input?.url || '');
      const targetsFormsubmit = url.includes('formsubmit.co');

      let nextInit = init || {};

      if (targetsFormsubmit) {
        const method = normalizeMethod(nextInit.method || (typeof input === 'object' && input.method));
        if (method !== 'POST') {
          console.warn('[FormSubmit Guard] fetch request forced to POST', { url, previousMethod: method || 'GET (default)' });
          nextInit = { ...nextInit, method: 'POST' };
        }

        const hasFormDataBody = nextInit.body instanceof FormData;
        if (!hasFormDataBody) {
          const matchingForm = actionToForm.get(url) || fallbackForm;
          if (matchingForm) {
            nextInit = { ...nextInit, body: new FormData(matchingForm) };
            console.warn('[FormSubmit Guard] fetch body replaced with FormData from form', { url });
          } else {
            nextInit = { ...nextInit, body: new FormData() };
            console.warn('[FormSubmit Guard] fetch to FormSubmit without FormData blocked from GET-style navigation', { url });
          }
        }
      }

      return originalFetch(input, nextInit);
    };
  });
})();
