(() => {
  const pageKey = document.body.dataset.page;
  const navLinks = document.querySelectorAll('[data-nav]');
  navLinks.forEach((link) => {
    if (link.dataset.nav === pageKey) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const backToTop = document.querySelector('[data-back-to-top]');
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
})();
