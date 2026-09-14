export function initCounters() {
  const items = document.querySelectorAll('[data-counter]');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.counted === 'true') return;
      animateCounter(entry.target);
      entry.target.dataset.counted = 'true';
    });
  }, { threshold: 0.45 });
  items.forEach((item) => observer.observe(item));
}

function animateCounter(node) {
  const target = Number(node.dataset.target || 0);
  const decimals = Number(node.dataset.decimals || 0);
  const prefix = node.dataset.prefix || '';
  const suffix = node.dataset.suffix || '';
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
