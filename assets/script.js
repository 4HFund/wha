(function () {
  const searchInput = document.getElementById('quick-search');
  const cards = Array.from(document.querySelectorAll('[data-search-grid] .card'));
  const backToTop = document.querySelector('[data-back-to-top]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      const behavior = prefersReducedMotion ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior });
    });

    const toggleBackToTop = () => {
      const show = window.scrollY > 240;
      backToTop.classList.toggle('is-visible', show);
    };

    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
  }
})();
