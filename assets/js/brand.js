export const SITE_BRAND = Object.freeze({
  token: 'FINKERNEL',
  name: 'FinKernel',
  legal: 'FinKernel Labs',
  domain: 'finkernel.js.org',
  npmScope: '@finkernel',
  repoPath: 'gmrafi/FinEngine',
  tagline: 'Programmable financial primitives for modern JavaScript.',
  heroTitle: 'Financial infrastructure for web products that cannot afford ambiguous logic.',
  heroLead: 'FinKernel packages lending math, validation, payment utilities, reporting helpers, and interactive JavaScript demos into a documentation-first flagship site that still feels lightweight to developers.',
});

export function applyBrand() {
  document.documentElement.dataset.brandToken = SITE_BRAND.token;
  document.querySelectorAll('[data-brand]').forEach((node) => {
    const key = node.dataset.brand;
    if (key && SITE_BRAND[key]) node.textContent = SITE_BRAND[key];
  });
  document.title = SITE_BRAND.name;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', `${SITE_BRAND.name} is ${SITE_BRAND.tagline}`);
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', '#0B0F19');
}
