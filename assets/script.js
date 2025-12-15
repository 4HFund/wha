(function () {
  const searchInput = document.getElementById('quick-search');
  const cards = Array.from(document.querySelectorAll('[data-search-grid] .card'));
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const backToTop = document.querySelector('.back-to-top');

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
})();
