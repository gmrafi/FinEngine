export function initReveal() {
  const items = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!items.length) return;

  const showAll = () => items.forEach((item) => item.classList.add('is-visible'));

  if (!('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  document.documentElement.classList.add('reveal-ready');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
  window.setTimeout(showAll, 900);
}
