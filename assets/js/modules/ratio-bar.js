export function initRatioBar() {
  const cards = document.querySelectorAll(".ratio-card");
  if (!cards.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function animateValue(el, target, duration) {
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = Number(el.dataset.decimals || 0);
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const bar = card.querySelector(".ratio-bar");
        if (!bar) return;

        const segments = bar.querySelectorAll(".ratio-bar-segment");
        segments.forEach((seg) => {
          const width = seg.dataset.width;
          if (!width) return;
          seg.style.setProperty("--target-width", `${width}%`);
          if (prefersReduced.matches) {
            seg.classList.add("is-animated");
          } else {
            requestAnimationFrame(() => seg.classList.add("is-animated"));
          }
        });

        const delay = prefersReduced.matches ? 0 : 600;
        setTimeout(() => {
          card.querySelectorAll("[data-animate-value]").forEach((el) => {
            const target = Number(el.dataset.animateValue || 0);
            animateValue(el, target, 1000);
          });
        }, delay);

        observer.unobserve(card);
      });
    },
    { threshold: 0.3 },
  );

  cards.forEach((card) => observer.observe(card));
}
