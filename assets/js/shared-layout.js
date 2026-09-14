import { SITE_BRAND } from './brand.js';

const NAV_ITEMS = [
  { label: 'Positioning', homeHref: '#positioning' },
  { label: 'Packages', homeHref: '#packages' },
  { label: 'Docs', homeHref: '#docs-api', page: 'docs' },
  { label: 'Examples', homeHref: '#examples-gallery' },
  { label: 'Playground', homeHref: '#playground' },
  { label: 'বাংলাদেশ', homeHref: '#bangladesh-learning' },
  { label: 'Collaborate', homeHref: '#collab' },
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

const TRUST_CHIPS = [
  { label: 'Open source on GitHub', href: 'https://github.com/gmrafi/FinEngine' },
  { label: 'Live docs on GitHub Pages', href: 'https://gmrafi.github.io/FinEngine/' },
  { label: 'Examples gallery', href: 'https://gmrafi.github.io/FinEngine/docs/examples/' },
  { label: 'Structured issue intake', href: 'https://github.com/gmrafi/FinEngine/issues/new/choose' },
  { label: 'Bangladesh-aware finance learning', href: 'https://gmrafi.github.io/FinEngine/#bangladesh-learning' },
];

export function initSharedLayout() {
  const pageType = document.body.dataset.page || inferPageType();
  const homePrefix = pageType === 'home' ? '' : '../../index.html';
  const headerMount = document.querySelector('[data-site-header]');
  const footerMount = document.querySelector('[data-site-footer]');
  const proofMount = document.querySelector('[data-social-proof]');

  if (headerMount) headerMount.innerHTML = renderHeader(pageType, homePrefix);
  if (proofMount) proofMount.innerHTML = renderProofStrip();
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

function renderHeader(pageType, homePrefix) {
  const logoPath = pageType === 'home' ? 'logo-mark.png' : '../../logo-mark.png';
  const nav = NAV_ITEMS.map((item) => {
    const href = pageType === 'home' ? item.homeHref : `${homePrefix}${item.homeHref}`;
    const key = item.page || item.homeHref.replace('#', '');
    return `<a data-nav-link data-nav-key="${key}" href="${href}">${item.label}</a>`;
  }).join('');

  return `
    <header class="topbar shared-topbar">
      <div class="shell topbar-inner shared-topbar-inner">
        <a class="brandline brandlink" href="${pageType === 'home' ? '#top' : homePrefix}">
          <div class="brandmark" aria-hidden="true"><img src="${logoPath}" alt="" loading="eager" decoding="async" /></div>
          <div>
            <span data-brand="name"></span>
            <span class="brand-sub">Open-source finance tooling for JavaScript teams</span>
          </div>
        </a>
        <nav class="navlinks" aria-label="Primary navigation">${nav}</nav>
        <div class="toolbar header-actions">
          <a class="star-cta" href="https://github.com/gmrafi/FinEngine/stargazers" target="_blank" rel="noreferrer">
            <span>Star on GitHub</span>
            <img src="https://img.shields.io/github/stars/gmrafi/FinEngine?style=social" alt="GitHub stars for gmrafi/FinEngine" />
          </a>
          <button class="theme-toggle" type="button" data-theme-toggle aria-label="Light mode active" aria-pressed="false"><span class="theme-toggle-track" aria-hidden="true"><span class="theme-toggle-thumb"></span></span><span class="theme-toggle-label">Light</span></button>
          <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="site-mobile-menu">Menu</button>
        </div>
      </div>
      <div class="shell mobile-drawer" id="site-mobile-menu" data-mobile-menu hidden>
        <nav class="mobile-nav" aria-label="Mobile navigation">${nav}</nav>
      </div>
    </header>
  `;
}

function renderProofStrip() {
  const badges = PROOF_BADGES.map((badge) => `
    <a class="proof-badge" href="${badge.href}" target="_blank" rel="noreferrer">
      <img src="${badge.image}" alt="${badge.alt}" />
    </a>
  `).join('');

  const chips = TRUST_CHIPS.map((chip) => `<a class="trust-chip" href="${chip.href}">${chip.label}</a>`).join('');

  return `
    <section class="proof-strip shell" aria-label="Open source trust signals">
      <div class="proof-panel">
        <div>
          <div class="eyebrow">Live repo reporter</div>
          <h2 class="proof-title">Repository activity, deployment badges, and open-source trust in one strip</h2>
          <p class="proof-copy">Live stars, workflow badges, license state, and recent commit signals stay attached to the public repository so the homepage feels maintained instead of decorative.</p>
        </div>
        <div class="proof-badges">${badges}</div>
        <div class="trust-row">${chips}</div>
      </div>
    </section>
  `;
}

function renderFooter() {
  return `
    <footer class="shell site-footer-shell">
      <div class="footer-panel site-footer-panel">
        <div class="site-footer-grid">
          <section class="footer-column footer-column-brand" aria-label="Brand and institution">
            <a class="footer-brand" href="https://gmrafi.github.io/FinEngine/">FinEngine Labs</a>
            <p class="footer-intro">Deterministic financial logic, lending calculations, and localized payment tooling for modern JavaScript teams.</p>
            <div class="footer-highlight-card">
              <div class="footer-card-title">Institutional Research Backing</div>
              <p>An open-source developer initiative incubated by the <a href="https://web.cfsbr.com/"><strong>Centre for Fintech &amp; Strategic Business Research (CFSBR)</strong></a>.</p>
              <p><strong>Official website:</strong> <a href="https://web.cfsbr.com/">web.cfsbr.com</a></p>
            </div>
            <div class="footer-reference-links">
              <a class="footer-reference-link" href="https://www.gmrafi.com.bd/">Official website · Md Golam Mubasshir Rafi</a>
            </div>
            <div class="footer-license-row">
              <a class="footer-license-badge" href="https://github.com/gmrafi/FinEngine/blob/main/LICENSE">MIT Licensed · Free &amp; Open Source</a>
            </div>
          </section>

          <section class="footer-column" aria-label="Packages">
            <div class="footer-heading">PACKAGES</div>
            <div class="footer-link-list">
              <a href="https://gmrafi.github.io/FinEngine/docs/core/"><strong>@finengine/core</strong><span>Validation &amp; Money Kernel</span></a>
              <a href="https://gmrafi.github.io/FinEngine/docs/math/"><strong>@finengine/math</strong><span>Amortization &amp; XIRR Engine</span></a>
              <a href="https://gmrafi.github.io/FinEngine/docs/ui/"><strong>@finengine/ui</strong><span>Fintech Micro-Components</span></a>
              <div class="footer-soon-item"><strong>FinEngine Pro</strong><span class="footer-soon-badge">Coming Soon</span></div>
            </div>
          </section>

          <section class="footer-column" aria-label="Documentation">
            <div class="footer-heading">DOCUMENTATION</div>
            <div class="footer-link-list">
              <a href="https://gmrafi.github.io/FinEngine/#playground"><strong>Amortization Sandbox</strong><span>Interactive loan playground</span></a>
              <a href="https://gmrafi.github.io/FinEngine/#bangladesh-learning"><strong>BDT Financial Rules</strong><span>Bangladesh finance learning track</span></a>
              <a href="https://gmrafi.github.io/FinEngine/docs/examples/"><strong>Executed API Docs</strong><span>Code and function reference</span></a>
              <a href="https://gmrafi.github.io/FinEngine/docs/release/"><strong>Offline Runtime Setup</strong><span>Local and offline guide</span></a>
            </div>
          </section>

          <section class="footer-column" aria-label="Ecosystem">
            <div class="footer-heading">ECOSYSTEM</div>
            <div class="footer-link-list">
              <a href="https://github.com/gmrafi/FinEngine"><strong>GitHub Repository</strong><span>Source code and contribution</span></a>
              <a href="https://github.com/gmrafi/FinEngine/issues/new/choose"><strong>Report an Issue</strong><span>Bug and feature request</span></a>
              <a href="https://web.cfsbr.com/"><strong>CFSBR Intelligence Hub</strong><span>Research and data background</span></a>
              <a href="https://www.gmrafi.com.bd/"><strong>Enterprise Inquiry</strong><span>Commercial and custom integration</span></a>
            </div>
          </section>
        </div>

        <div class="footer-bottom-strip">
          <div class="footer-bottom-left">© 2026 FinEngine Labs. Architected and maintained by Md Golam Mubasshir Rafi.</div>
          <div class="footer-bottom-right">v0.1.0-alpha · finengine.js.org</div>
          <p class="footer-disclaimer">Disclaimer: FinEngine is an open-source algorithmic computation and simulation toolkit incubated by the <strong>Centre for Fintech &amp; Strategic Business Research (CFSBR)</strong>. It is engineered for workflow automation, academic modeling, and software integration. Production accounting ledgers, statutory filings, and credit-scoring implementations should always be audited in compliance with applicable central bank regulations and statutory accounting frameworks.</p>
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
  if (pageType === 'docs') {
    links.forEach((link) => {
      if (link.dataset.navKey === 'docs') link.classList.add('is-active');
    });
  }
}
