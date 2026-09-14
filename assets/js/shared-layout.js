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
  const nav = NAV_ITEMS.map((item) => {
    const href = pageType === 'home' ? item.homeHref : `${homePrefix}${item.homeHref}`;
    const key = item.page || item.homeHref.replace('#', '');
    return `<a data-nav-link data-nav-key="${key}" href="${href}">${item.label}</a>`;
  }).join('');

  return `
    <header class="topbar shared-topbar">
      <div class="shell topbar-inner shared-topbar-inner">
        <a class="brandline brandlink" href="${pageType === 'home' ? '#top' : homePrefix}">
          <div class="brandmark" data-brand="mark">FE</div>
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
          <button class="theme-toggle" type="button" data-theme-toggle>Switch theme</button>
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
          <div class="eyebrow">Open-source trust</div>
          <h2 class="proof-title">Trust signals linked to live repository activity</h2>
          <p class="proof-copy">Stars, workflow badges, license status, and latest-commit metadata stay tied to the public repository and deployment surface.</p>
        </div>
        <div class="proof-badges">${badges}</div>
        <div class="trust-row">${chips}</div>
      </div>
    </section>
  `;
}

function renderFooter() {
  return `
    <footer class="shell">
      <div class="footer-panel">
        <div class="footer-meta">
          <span><span data-brand="legal"></span> · <span data-brand="tagline"></span></span>
          <span><a href="https://github.com/gmrafi/FinEngine"><span data-brand="repoPath"></span></a> · <a href="https://gmrafi.github.io/FinEngine/">GitHub Pages</a></span>
          <span>Designed and developed by Md Golam Mubasshir Rafi. Powered by Centre for Fintech &amp; Strategic Business Research (CFSBR).</span>
          <span>Disclaimer: FinEngine is a deterministic algorithmic engine built for educational, computational, and integration purposes. Production ledgers and statutory regulatory filings should always be cross-audited against central bank guidelines.</span>
        </div>
        <div class="footer-links">
          <a href="https://gmrafi.github.io/FinEngine/docs/core/">Core docs</a>
          <a href="https://gmrafi.github.io/FinEngine/docs/math/">Math docs</a>
          <a href="https://gmrafi.github.io/FinEngine/docs/ui/">UI docs</a>
          <a href="https://gmrafi.github.io/FinEngine/docs/examples/">Examples gallery</a>
          <a href="https://gmrafi.github.io/FinEngine/docs/release/">Release checklist</a>
          <a href="https://github.com/gmrafi/FinEngine/issues/new/choose">Open issue</a>
          <a href="https://github.com/gmrafi/FinEngine/stargazers">Star repo</a>
          <span>Static site build · <span data-generated-year></span></span>
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
