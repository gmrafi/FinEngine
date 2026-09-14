import { SITE_BRAND } from './brand.js';

const NAV_ITEMS = [
  { label: 'Home', path: 'index.html', key: 'home' },
  { label: 'Product', path: 'product/', key: 'product' },
  { label: 'Simulation', path: 'simulation/', key: 'simulation' },
  { label: 'Methodology', path: 'methodology/', key: 'methodology' },
  { label: 'Docs', path: 'docs/', key: 'docs' },
  { label: 'Brand', path: 'brand/', key: 'brand' },
  { label: 'About', path: 'about/', key: 'about' },
  { label: 'Contact', path: 'contact/', key: 'contact' },
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

  return `
    <header class="topbar shared-topbar">
      <div class="shell topbar-inner shared-topbar-inner header-shell">
        <a class="brandline brandlink" href="${toRoot('index.html')}">
          <img class="header-logo" src="${logoPath}" alt="FinEngine logo" loading="eager" decoding="async" />
          <span class="brand-copy">
            <span class="brand-row"><span data-brand="name"></span></span>
            <span class="brand-sub">Documentation-first finance primitives for packages, demos, and research-backed product surfaces</span>
          </span>
        </a>
        <nav class="navlinks navlinks-pill" aria-label="Primary navigation">${nav}</nav>
        <div class="toolbar header-actions">
          <a class="star-cta header-primary-cta" href="${toRoot('docs/')}"><span>Open docs</span></a>
          <button class="theme-toggle theme-toggle-compact" type="button" data-theme-toggle aria-label="Toggle color theme" aria-pressed="false"><span class="theme-toggle-track" aria-hidden="true"><span class="theme-toggle-thumb"></span></span></button>
          <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="site-mobile-menu" aria-label="Open navigation menu"><span class="menu-toggle-lines" aria-hidden="true"><span></span><span></span></span></button>
        </div>
      </div>
      <div class="shell mobile-drawer" id="site-mobile-menu" data-mobile-menu hidden>
        <div class="mobile-drawer-card">
          <div class="mobile-drawer-actions">
            <a class="star-cta mobile-docs-cta" href="${toRoot('docs/')}"><span>Open docs</span></a>
            <a class="mini-btn mobile-demo-cta" href="${toRoot('simulation/')}">Open simulation</a>
          </div>
          <nav class="mobile-nav" aria-label="Mobile navigation">${nav}</nav>
        </div>
      </div>
    </header>
  `;
}

function renderProofStrip(pageType) {
  if (!['home', 'product', 'docs', 'brand'].includes(pageType)) return '';
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
          <p class="proof-copy">The new information architecture keeps proof below the first fold so the homepage feels calmer while still showing real repository activity.</p>
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
        <div class="site-footer-grid">
          <section class="footer-column footer-column-brand" aria-label="Brand and institution">
            <a class="footer-brand footer-brandline" href="${root}index.html"><img class="footer-logo" src="${root}logo-mark.png" alt="FinEngine logo" loading="lazy" decoding="async" /><span>FinEngine</span></a>
            <p class="footer-intro">A multi-page JavaScript finance surface for deterministic calculations, explainable demos, and enterprise-facing documentation.</p>
            <div class="footer-highlight-card footer-powered-card">
              <div class="footer-card-title footer-card-title-gold">Powered by</div>
              <p><a href="https://web.cfsbr.com/"><strong>Centre for FinTech &amp; Strategic Business Research (CFSBR)</strong></a></p>
            </div>
            <div class="footer-license-row">
              <a class="footer-license-badge" href="https://github.com/gmrafi/FinEngine/blob/main/LICENSE">MIT Licensed · Free &amp; Open Source</a>
            </div>
          </section>

          <section class="footer-column" aria-label="Explore">
            <div class="footer-heading">EXPLORE</div>
            <div class="footer-link-list">
              <a href="${root}product/"><strong>Product Surface</strong><span>Packages, product framing, and example outputs</span></a>
              <a href="${root}simulation/"><strong>Simulation Lab</strong><span>Dedicated amortization and repayment playground</span></a>
              <a href="${root}docs/"><strong>Documentation Hub</strong><span>Package docs, examples, and release notes</span></a>
              <a href="${root}brand/"><strong>Brand Assets</strong><span>Logo kit, palette, and usage guidance</span></a>
            </div>
          </section>

          <section class="footer-column" aria-label="Packages">
            <div class="footer-heading">PACKAGES</div>
            <div class="footer-link-list">
              <a href="${root}docs/core/"><strong>@finengine/core</strong><span>Validation &amp; money primitives</span></a>
              <a href="${root}docs/math/"><strong>@finengine/math</strong><span>Amortization, XIRR, and repayment math</span></a>
              <a href="${root}docs/ui/"><strong>@finengine/ui</strong><span>Finance-oriented UI helpers</span></a>
            </div>
          </section>

          <section class="footer-column" aria-label="Connect">
            <div class="footer-heading">CONNECT</div>
            <div class="footer-link-list">
              <a href="${root}contact/"><strong>Contact</strong><span>Collaboration and implementation pathways</span></a>
              <a href="https://github.com/gmrafi/FinEngine/issues/new/choose"><strong>Report an Issue</strong><span>Structured bug and feature intake</span></a>
              <a href="https://www.gmrafi.com.bd/"><strong>Founder Profile</strong><span><strong>Md Golam Mubasshir Rafi</strong></span></a>
            </div>
          </section>
        </div>

        <div class="footer-bottom-strip">
          <div class="footer-bottom-left">© 2026 FinEngine · Built by <strong>Md Golam Mubasshir Rafi</strong> · Powered by <span class="footer-powered-inline">CFSBR</span></div>
          <div class="footer-bottom-right">v0.3.0 · Multi-page GitHub Pages</div>
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
