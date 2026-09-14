export const BRAND_TOKEN = 'FINENGINE';

export const BRAND_CANDIDATES = Object.freeze([
  {
    name: 'FinEngine',
    verdict: 'recommended',
    rationale: 'Direct, credible, and easy to understand for a finance-focused JavaScript toolkit.',
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
  name: 'FinEngine',
  mark: 'FE',
  legal: 'FinEngine Labs',
  domain: 'finengine.js.org',
  npmScope: '@finengine',
  repoPath: 'gmrafi/FinEngine',
  tagline: 'Financial logic and reusable tooling for modern JavaScript.',
  heroTitle: 'JavaScript financial tooling for products that cannot afford ambiguous logic.',
  heroLead: 'FinEngine packages lending math, validation, payment utilities, reporting helpers, API examples, and Bangladesh-aware finance learning modules into a documentation-first JavaScript ecosystem.',
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
  if (themeMeta) {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    themeMeta.setAttribute('content', theme === 'light' ? '#F8FBFF' : '#0B0F19');
  }
}
