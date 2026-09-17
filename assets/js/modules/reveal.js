export function initReveal() {
  const items = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!items.length) return;

  const showAll = () =>
    items.forEach((item) => item.classList.add("is-visible"));

  if (!("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  document.documentElement.classList.add("reveal-ready");

  const groups = new Map();
  items.forEach((item) => {
    const parent = item.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(item);
  });

  groups.forEach((siblings) => {
    if (siblings.length <= 1) return;
    siblings.forEach((item, i) => {
      item.style.setProperty("--reveal-delay", `${i * 0.08}s`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px",
    },
  );

  items.forEach((item) => observer.observe(item));

  // If user prefers reduced motion, show everything immediately
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    showAll();
  } else {
    // Only reveal above-the-fold items immediately on initial load
    window.setTimeout(() => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          item.classList.add("is-visible");
        }
      });
    }, 150);
  }
}
