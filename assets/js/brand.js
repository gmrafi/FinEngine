export const BRAND_TOKEN = 'FINKERNEL';

export const BRAND_CANDIDATES = Object.freeze([
  {
    name: 'FinKernel',
    verdict: 'recommended',
    rationale: 'Most natural fit for a developer-first package ecosystem with a strong computation-core metaphor.',
  },
  {
    name: 'FinLayer',
    verdict: 'strong',
    rationale: 'Good middleware/platform tone if you want a softer enterprise-facing brand.',
  },
  {
    name: 'FinGrid',
    verdict: 'strong',
    rationale: 'Suggests systems, rails, data flow, and infrastructure breadth.',
  },
  {
    name: 'FinScope',
    verdict: 'situational',
    rationale: 'Best if the long-term positioning leans toward audit, analytics, and observability.',
  },
  {
    name: 'LedgerForge',
    verdict: 'memorable',
    rationale: 'Distinctive for ledger-heavy products, but more category-specific.',
  },
  {
    name: 'FinEngine',
    verdict: 'fallback',
    rationale: 'Credible but more generic than the options above.',
  },
]);

export const SITE_BRAND = Object.freeze({
  token: BRAND_TOKEN,
  name: 'FinKernel',
  mark: 'FK',
  legal: 'FinKernel Labs',
  domain: 'finkernel.js.org',
  npmScope: '@finkernel',
  repoPath: 'gmrafi/FinEngine',
  tagline: 'Programmable financial primitives for modern JavaScript.',
  heroTitle: 'Financial infrastructure for web products that cannot afford ambiguous logic.',
  heroLead: 'FinKernel packages lending math, validation, payment utilities, reporting helpers, and interactive JavaScript demos into a documentation-first flagship site that still feels lightweight to developers.',
});

export function applyBrand() {
  document.documentElement.dataset.brandToken = BRAND_TOKEN;
  document.documentElement.style.setProperty('--brand-token', `'${BRAND_TOKEN}'`);
  document.documentElement.style.setProperty('--brand-name', `'${SITE_BRAND.name}'`);
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
