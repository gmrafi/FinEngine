export function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links = Array.from(document.querySelectorAll('[data-nav-link]'));
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0.01 });

  sections.forEach((section) => observer.observe(section));
}
