const input = document.querySelector('[data-search]');
const cards = Array.from(document.querySelectorAll('[data-search-item]'));
if (input) {
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    cards.forEach(card => {
      const text = ((card.dataset.keywords || '') + ' ' + card.textContent).toLowerCase();
      card.classList.toggle('hidden-card', q.length > 0 && !text.includes(q));
    });
  });
}
