export function initReveal() {
  const items = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!items.length) return;

  const showAll = () => items.forEach((item) => item.classList.add('is-visible'));

  if (!('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  document.documentElement.classList.add('reveal-ready');

  const groups = new Map();
  items.forEach((item) => {
    const parent = item.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(item);
  });

  groups.forEach((siblings) => {
    if (siblings.length <= 1) return;
    siblings.forEach((item, i) => {
      item.style.setProperty('--reveal-delay', `${i * 0.08}s`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
  window.setTimeout(showAll, 900);
}
