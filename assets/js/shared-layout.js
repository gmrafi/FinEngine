import { SITE_BRAND } from './brand.js';
import { initQuickNav } from './modules/quick-nav.js';

const SPONSOR = Object.freeze({
  name: 'Centre for Fintech & Strategic Business Research',
  short: 'CFSBR',
  url: 'https://web.cfsbr.com/',
});

const NAV_ITEMS = [
  { label: 'Home', path: 'index.html', key: 'home' },
  { label: 'Product', path: 'product/', key: 'product' },
  { label: 'Simulations', path: 'simulation/', key: 'simulation' },
  { label: 'Docs', path: 'docs/', key: 'docs' },
  { label: 'Methodology', path: 'methodology/', key: 'methodology' },
  { label: 'Contact', path: 'contact/', key: 'contact' },
];

const MOBILE_EXTRA_ITEMS = [
  { label: '@finengine/core', path: 'docs/core/' },
  { label: '@finengine/math', path: 'docs/math/' },
  { label: '@finengine/ui', path: 'docs/ui/' },
  { label: 'About', path: 'about/' },
];

const PROOF_BADGES = [
  {
    href: 'https://github.com/gmrafi/FinEngine/stargazers',
    image: 'https://img.shields.io/github/stars/gmrafi/FinEngine?style=social',
    alt: 'GitHub stars for gmrafi/FinEngine',
  },
  {
    href: 'https://github.com/gmrafi/FinEngine/actions/workflows/verify.yml',
    image: 'https://github.com/gmrafi/FinEngine/actions/workflows/verify.yml/badge.svg',
    alt: 'Verify workflow status',
  },
  {
    href: 'https://github.com/gmrafi/FinEngine/actions/workflows/pages.yml',
    image: 'https://github.com/gmrafi/FinEngine/actions/workflows/pages.yml/badge.svg',
    alt: 'Pages deploy workflow status',
  },
  {
    href: 'https://github.com/gmrafi/FinEngine/blob/main/LICENSE',
    image: 'https://img.shields.io/github/license/gmrafi/FinEngine',
    alt: 'GitHub license for gmrafi/FinEngine',
  },
  {
    href: 'https://github.com/gmrafi/FinEngine/commits/main',
    image: 'https://img.shields.io/github/last-commit/gmrafi/FinEngine',
    alt: 'Last commit for gmrafi/FinEngine',
  },
];

function toRoot(path = '') {
  return `${getRootPath()}${path}`;
}

function getRootPath() {
  return document.body?.dataset.rootPath || '';
}

export function initSharedLayout() {
  const pageType = document.body.dataset.page || inferPageType();
  const headerMount = document.querySelector('[data-site-header]');
  const footerMount = document.querySelector('[data-site-footer]');
  const proofMount = document.querySelector('[data-social-proof]');

  if (headerMount) headerMount.innerHTML = renderHeader(pageType);
  if (proofMount) proofMount.innerHTML = renderProofStrip(pageType);
  if (footerMount) footerMount.innerHTML = renderFooter();

  bindMobileMenu();
  markActiveNav(pageType);
  initQuickNav();

  const yearNode = document.querySelector('[data-generated-year]');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
}

function inferPageType() {
  if (window.location.pathname.includes('/docs/')) return 'docs';
  return 'home';
}

function renderHeader(pageType) {
  const root = getRootPath();
  const logoPath = `${root}logo-mark.png`;
  const nav = NAV_ITEMS.map((item) => {
    const href = root + item.path;
    return `<a data-nav-link data-nav-key="${item.key}" href="${href}">${item.label}</a>`;
  }).join('');
  const mobileNav = [...NAV_ITEMS, ...MOBILE_EXTRA_ITEMS].map((item) => {
    const href = root + item.path;
    return `<a${item.key ? ` data-nav-link data-nav-key="${item.key}"` : ''} href="${href}">${item.label}</a>`;
  }).join('');

  return `
    <header class="topbar shared-topbar">
      <div class="shell topbar-inner shared-topbar-inner header-shell header-shell-restored">
        <a class="brandline brandlink" href="${toRoot('index.html')}">
          <img class="header-logo" src="${logoPath}" alt="FinEngine logo" loading="eager" decoding="async" />
          <span class="brand-copy">
            <span class="brand-row"><span data-brand="name"></span></span>
            <span class="brand-sub">Documentation-first finance primitives for packages, demos, and research-backed product surfaces</span>
          </span>
        </a>
        <nav class="navlinks navlinks-pill header-nav-simple" aria-label="Primary navigation">${nav}</nav>
        <div class="toolbar header-actions">
          <a class="header-icon-link" href="https://github.com/gmrafi/FinEngine" target="_blank" rel="noopener noreferrer" aria-label="Open FinEngine GitHub repository">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .5C5.65.5.5 5.66.5 12.03c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56 0-.28-.01-1.2-.02-2.17-3.2.7-3.88-1.37-3.88-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.76.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .97-.31 3.18 1.17a11.08 11.08 0 0 1 5.79 0c2.2-1.48 3.17-1.17 3.17-1.17.63 1.57.24 2.73.12 3.02.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.37-5.25 5.66.41.36.78 1.08.78 2.18 0 1.58-.01 2.86-.01 3.25 0 .31.21.68.8.56 4.56-1.54 7.84-5.86 7.84-10.95C23.5 5.66 18.35.5 12 .5Z"/></svg>
          </a>
          <button class="quick-nav-toggle" type="button" data-quick-nav-toggle aria-label="Quick navigation (Ctrl+K)" title="Quick navigation (Ctrl+K)"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="16" height="16"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="quick-nav-kbd">⌘K</span></button>
          <button class="theme-toggle theme-toggle-compact" type="button" data-theme-toggle aria-label="Toggle color theme" aria-pressed="false"><span class="theme-toggle-track" aria-hidden="true"><span class="theme-toggle-thumb"></span></span></button>
          <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="site-mobile-menu" aria-label="Open navigation menu"><span class="menu-toggle-lines" aria-hidden="true"><span></span><span></span><span></span></span></button>
        </div>
      </div>
      <div class="shell mobile-drawer" id="site-mobile-menu" data-mobile-menu hidden>
        <div class="mobile-drawer-card">
          <div class="mobile-drawer-actions">
            <a class="star-cta mobile-docs-cta" href="${toRoot('docs/')}" ><span>Open docs</span></a>
            <a class="mini-btn mobile-demo-cta" href="${toRoot('simulation/')}">Open simulations</a>
            <a class="mini-btn mobile-demo-cta mobile-external-cta" href="https://github.com/gmrafi/FinEngine" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
          <nav class="mobile-nav" aria-label="Mobile navigation">${mobileNav}</nav>
        </div>
      </div>
    </header>
  `;
}

function renderProofStrip(pageType) {
  if (pageType !== 'home') return '';
  const badges = PROOF_BADGES.map((badge) => `
    <a class="proof-badge" href="${badge.href}" target="_blank" rel="noreferrer">
      <img src="${badge.image}" alt="${badge.alt}" />
    </a>
  `).join('');

  const chips = [
    { label: 'Live product', href: toRoot('product/') },
    { label: 'Simulation lab', href: toRoot('simulation/') },
    { label: 'Package docs', href: toRoot('docs/') },
    { label: 'Brand assets', href: toRoot('brand/') },
    { label: 'GitHub repository', href: 'https://github.com/gmrafi/FinEngine' },
  ].map((chip) => `<a class="trust-chip" href="${chip.href}">${chip.label}</a>`).join('');

  return `
    <section class="proof-strip shell" aria-label="Open source trust signals">
      <div class="proof-panel compact-proof-panel">
        <div>
          <div class="eyebrow">Trust signals</div>
          <h2 class="proof-title">Source, docs, and deploy signals stay visible without overloading the hero.</h2>
          <p class="proof-copy">The credibility layer now stays on the homepage only, while inner pages remain focused on their own task flows.</p>
        </div>
        <div class="proof-badges">${badges}</div>
        <div class="trust-row">${chips}</div>
      </div>
    </section>
  `;
}

function renderFooter() {
  const root = getRootPath();
  return `
    <footer class="shell site-footer-shell">
      <div class="footer-panel site-footer-panel">
        <div class="site-footer-grid site-footer-grid-4">
          <section class="footer-column footer-column-brand" aria-label="Brand and institution">
            <a class="footer-brand footer-brandline" href="${root}index.html"><img class="footer-logo" src="${root}logo-mark.png" alt="FinEngine Labs logo" loading="lazy" decoding="async" /><span>FinEngine Labs</span></a>
            <p class="footer-intro">A computational research and simulation platform for deterministic finance — documentation-first JavaScript tooling for reproducible calculations, explainable demos, and research-backed product surfaces.</p>
            <div class="footer-highlight-card footer-powered-card footer-static-card">
              <div class="footer-card-title footer-card-title-gold">A CFSBR Computational Initiative</div>
              <p><a href="${SPONSOR.url}" target="_blank" rel="noopener noreferrer"><strong>${SPONSOR.name} (${SPONSOR.short})</strong></a></p>
            </div>
          </section>

          <section class="footer-column" aria-label="Labs and simulators">
            <div class="footer-heading">LABS &amp; SIMULATORS</div>
            <div class="footer-link-list">
              <a href="${root}simulation/"><strong>Simulation Lab</strong><span>Installment, SME, and merchant scenarios</span></a>
              <a href="${root}simulation/#simulator-student"><strong>Student Installment</strong><span>Laptop and study financing plan</span></a>
              <a href="${root}simulation/#simulator-sme"><strong>SME Working Capital</strong><span>Installment burden under stronger cashflow</span></a>
              <a href="${root}simulation/#simulator-merchant"><strong>Merchant Restock</strong><span>Short-duration float scenarios</span></a>
              <a href="${root}product/"><strong>Scenario Playground</strong><span>Package surface and executables</span></a>
            </div>
          </section>

          <section class="footer-column" aria-label="Documentation">
            <div class="footer-heading">DOCUMENTATION</div>
            <div class="footer-link-list">
              <a href="${root}docs/"><strong>Documentation Hub</strong><span>Package docs, examples, and release notes</span></a>
              <a href="${root}docs/core/"><strong>@finengine/core</strong><span>Validation and money primitives</span></a>
              <a href="${root}docs/math/"><strong>@finengine/math</strong><span>Amortization, XIRR, and repayment math</span></a>
              <a href="${root}docs/ui/"><strong>@finengine/ui</strong><span>Finance-oriented UI helpers</span></a>
              <a href="${root}docs/release/"><strong>Release Checklist</strong><span>v0.3.0 publish steps</span></a>
            </div>
          </section>

          <section class="footer-column" aria-label="Research, methodology, and community">
            <div class="footer-heading">RESEARCH &amp; COMMUNITY</div>
            <div class="footer-link-list">
              <a href="${root}methodology/"><strong>Research &amp; Methodology</strong><span>Positioning, localization, and roadmap logic</span></a>
              <a href="${root}methodology/#cite-finengine"><strong>Cite FinEngine (BibTeX)</strong><span>Academic citation for papers and theses</span></a>
              <a href="${root}brand/"><strong>Brand Assets</strong><span>Logo kit, palette, and usage guidance</span></a>
              <a class="is-external" href="https://github.com/gmrafi/FinEngine" target="_blank" rel="noopener noreferrer"><strong>GitHub Repository</strong><span>Source, commits, workflows, issues</span></a>
              <a class="is-external" href="https://github.com/gmrafi/FinEngine/issues/new/choose" target="_blank" rel="noopener noreferrer"><strong>Report an Issue</strong><span>Structured bug and feature intake</span></a>
              <a class="is-external" href="https://github.com/gmrafi/FinEngine/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"><strong>MIT License</strong><span>Free and open-source licensing terms</span></a>
            </div>
          </section>
        </div>

        <div class="footer-bottom-strip">
          <div class="footer-bottom-left">© 2026 <strong>FinEngine Labs</strong> · A CFSBR Computational Initiative<br />Built &amp; Maintained by <strong>Md Golam Mubasshir Rafi</strong> · Powered by <span class="footer-powered-inline">${SPONSOR.name}</span></div>
          <div class="footer-bottom-right"><a class="footer-release-link" href="https://github.com/gmrafi/FinEngine/releases/tag/v0.3.0" target="_blank" rel="noopener noreferrer">v0.3.0 · Multi-page product docs</a></div>
          <p class="footer-disclaimer">Disclaimer: FinEngine is an open-source computation and simulation toolkit. Production accounting ledgers, statutory filings, and credit-scoring implementations should always be audited under applicable regulatory and accounting frameworks.</p>
        </div>
      </div>
    </footer>
  `;
}

function bindMobileMenu() {
  const button = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!button || !menu) return;
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    menu.hidden = expanded;
  });
}

function markActiveNav(pageType) {
  const links = Array.from(document.querySelectorAll('[data-nav-link]'));
  if (!links.length) return;
  links.forEach((link) => {
    if (link.dataset.navKey === pageType) link.classList.add('is-active');
  });
}
