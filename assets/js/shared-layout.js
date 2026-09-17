import { SITE_BRAND } from './brand.js';
import { initQuickNav } from './modules/quick-nav.js';

const NAV_ITEMS = [
  { label: 'Home', path: './', key: 'home' },
  { label: 'Product', path: 'product/', key: 'product' },
  { label: 'Simulations', path: 'simulation/', key: 'simulation' },
  { label: 'Docs', path: 'docs/', key: 'docs' },
  { label: 'Methodology', path: 'methodology/', key: 'methodology' },
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
        <a class="brandline brandlink" href="${toRoot('')}">
          <img class="header-logo" src="${logoPath}" alt="FinEngine logo" loading="eager" decoding="async" />
          <span class="brand-copy">
            <span class="brand-row"><span data-brand="name"></span></span>
            <span class="brand-sub">Deterministic finance primitives for JavaScript.</span>
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
    { label: 'GitHub repository', href: 'https://github.com/gmrafi/FinEngine', external: true },
  ].map((chip) => {
    const ext = chip.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const arrow = chip.external ? '↗' : '→';
    return `<a class="trust-chip" href="${chip.href}"${ext}>${chip.label} <span class="trust-chip-arrow" aria-hidden="true">${arrow}</span></a>`;
  }).join('');

  const trustStrip = [
    { label: 'DOI', value: '10.67226/cfsbr.fe.2026.001.v1', href: 'https://doi.org/10.67226/cfsbr.fe.2026.001.v1', external: true },
    { label: 'Archive', value: 'CERN / Zenodo: 22769501', href: 'https://doi.org/10.5281/zenodo.22769501', external: true },
    { label: 'License', value: 'CC-BY 4.0 · MIT', href: 'https://github.com/gmrafi/FinEngine/blob/main/LICENSE', external: true },
    { label: 'Standards', value: 'Central Bank & BDT Formulations', href: toRoot('methodology/'), external: false },
    { label: 'Precision', value: 'IEEE-754 Safe', href: toRoot('methodology/'), external: false },
    { label: 'Architecture', value: 'Zero Dependencies', href: toRoot('docs/'), external: false },
    { label: 'Backing', value: 'CFSBR Initiative', href: toRoot('about/'), external: false },
    { label: 'Domain', value: 'js.org Verified', href: 'https://finengine.js.org', external: true },
  ].map((badge) => {
    const attrs = badge.external ? 'target="_blank" rel="noopener noreferrer"' : '';
    const arrow = badge.external ? '↗' : '→';
    return `<a class="trust-strip-badge" href="${badge.href}" ${attrs}><span class="trust-strip-label">${badge.label}:</span> <span class="trust-strip-value">${badge.value}</span> <span class="trust-strip-arrow" aria-hidden="true">${arrow}</span></a>`;
  }).join('');

  return `
    <section class="proof-strip shell" aria-label="Open source trust signals">
      <div class="proof-panel compact-proof-panel" data-reveal>
        <div class="proof-header-block">
          <div class="proof-header-copy">
            <div class="eyebrow eyebrow-blue">Verified Standards</div>
            <h2 class="proof-title">Engineered for Mathematical Permanence and Public Auditability.</h2>
            <p class="proof-copy">Permanent CERN Zenodo archiving, Crossref methodology indexing, and zero-dependency client-side execution.</p>
          </div>
          <div class="proof-header-ph">
            <a href="https://www.producthunt.com/products/finengine?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-finengine" target="_blank" rel="noopener noreferrer">
              <img alt="FinEngine - Deterministic financial math &amp; BDT-precision engine | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1251701&amp;theme=light&amp;t=1789641634770" />
            </a>
          </div>
        </div>
        <div class="proof-badges">${badges}</div>
        <div class="trust-strip">${trustStrip}</div>
        <div class="trust-row">${chips}</div>
      </div>
    </section>
  `;
}

function renderFooter() {
  const root = getRootPath();
  const logoPath = `${root}logo-mark.png`;
  return `
    <footer style="border-top: 1px solid var(--line); background: var(--bg-elevated, var(--bg)); padding: 56px 20px 32px; color: var(--text); font-family: inherit;">
      <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 36px; margin-bottom: 40px;">

        <section style="display: flex; flex-direction: column; gap: 14px;" aria-label="Brand and institution">
          <div style="display: flex; align-items: center; gap: 12px;">
            <a href="${root}" style="text-decoration: none; color: inherit; display: inline-flex; align-items: center; gap: 12px;">
              <img class="footer-logo" src="${logoPath}" alt="FinEngine logo" style="width: 36px; height: 36px; object-fit: contain; border-radius: 8px;" />
              <span style="font-weight: 800; font-size: 20px; color: #0f172a; letter-spacing: -0.02em;">FinEngine Labs</span>
            </a>
          </div>
          <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin: 0;">
            A computational research and simulation platform for deterministic finance: documentation-first JavaScript tooling for reproducible calculations, explainable demos, and research-backed product surfaces.
          </p>
          <div style="margin-top: 6px; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #2563eb; letter-spacing: 0.05em; margin-bottom: 4px;">
              A CFSBR Computational Initiative
            </div>
            <div style="font-size: 13px; font-weight: 600; color: #0f172a;">
              Centre for Fintech &amp; Strategic Business Research (CFSBR)
            </div>
          </div>
        </section>

        <section aria-label="Labs and simulators">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 18px;">
            LABS &amp; SIMULATORS
          </div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px;">
            <li>
              <a href="${root}simulation/" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Simulation Lab</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Installment, SME, and merchant scenarios</div>
              </a>
            </li>
            <li>
              <a href="${root}simulation/#student" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Student Installment</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Laptop and study financing plan</div>
              </a>
            </li>
            <li>
              <a href="${root}simulation/#sme" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">SME Working Capital</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Installment burden under stronger cashflow</div>
              </a>
            </li>
            <li>
              <a href="${root}simulation/#merchant" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Merchant Restock</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Short-duration float scenarios</div>
              </a>
            </li>
            <li>
              <a href="${root}simulation/#playground" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Scenario Playground</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Package surface and executables</div>
              </a>
            </li>
          </ul>
        </section>

        <section aria-label="Documentation">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 18px;">
            DOCUMENTATION
          </div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px;">
            <li>
              <a href="${root}docs/" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Documentation Hub</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Package docs, examples, and release notes</div>
              </a>
            </li>
            <li>
              <a href="${root}docs/core/" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">@finengine/core</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Validation and money primitives</div>
              </a>
            </li>
            <li>
              <a href="${root}docs/math/" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">@finengine/math</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Amortization, XIRR, and repayment math</div>
              </a>
            </li>
            <li>
              <a href="${root}docs/ui/" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">@finengine/ui</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Finance-oriented UI helpers</div>
              </a>
            </li>
            <li>
              <a href="${root}docs/release/" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Release Checklist</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">v0.3.0 publish steps</div>
              </a>
            </li>
          </ul>
        </section>

        <section aria-label="Research and community">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 18px;">
            RESEARCH &amp; COMMUNITY
          </div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px;">
            <li>
              <a href="${root}methodology/" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Research &amp; Methodology</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Positioning, localization, and roadmap logic</div>
              </a>
            </li>
            <li>
              <a href="${root}methodology/#cite-finengine" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Cite FinEngine (BibTeX)</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Academic citation for papers and theses</div>
              </a>
            </li>
            <li>
              <a href="${root}brand/" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Brand Assets</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Logo kit, palette, and usage guidance</div>
              </a>
            </li>
            <li>
              <a href="https://github.com/gmrafi/FinEngine" target="_blank" rel="noopener" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">GitHub Repository <span style="font-size: 10px; color: #94a3b8;">&#8599;</span></div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Source, commits, workflows, issues</div>
              </a>
            </li>
            <li>
              <a href="https://github.com/gmrafi/FinEngine/issues" target="_blank" rel="noopener" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Report an Issue <span style="font-size: 10px; color: #94a3b8;">&#8599;</span></div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Structured bug and feature intake</div>
              </a>
            </li>
            <li>
              <a href="${root}CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Contributing <span style="font-size: 10px; color: #94a3b8;">&#8599;</span></div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Guidelines for developers</div>
              </a>
            </li>
            <li>
              <a href="${root}CODE_OF_CONDUCT.md" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Code of Conduct <span style="font-size: 10px; color: #94a3b8;">&#8599;</span></div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Community standards</div>
              </a>
            </li>
            <li>
              <a href="https://www.producthunt.com/products/finengine" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Product Hunt <span style="font-size: 10px; color: #94a3b8;">&#8599;</span></div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Featured launch and community discussions</div>
              </a>
            </li>
            <li>
              <a href="${root}LICENSE" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">MIT License <span style="font-size: 10px; color: #94a3b8;">&#8599;</span></div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Free and open-source licensing terms</div>
              </a>
            </li>
            <li>
              <a href="https://www.npmjs.com/org/finengine" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: block;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">npm Organization <span style="font-size: 10px; color: #94a3b8;">&#8599;</span></div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Official verified package registry</div>
              </a>
            </li>
          </ul>
        </section>

      </div>

      <div style="max-width: 1200px; margin: 0 auto; padding-top: 24px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 12px; font-size: 12px; color: var(--muted); line-height: 1.6;">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px;">
          <div>
            <strong style="color: var(--text);">&#169; ${new Date().getFullYear()} FinEngine Labs</strong> &#183; A CFSBR Computational Initiative
          </div>
          <div style="font-family: monospace; font-size: 11px; color: var(--muted); background: var(--panel-soft); border: 1px solid var(--line); padding: 2px 8px; border-radius: 4px;">
            v0.3.0 &#183; Multi-page product docs
          </div>
        </div>

        <div style="color: var(--muted);">
          Built &amp; Maintained by <strong style="color: var(--text);">Md Golam Mubasshir Rafi</strong> &#183; Powered by <strong style="color: var(--text);">Centre for Fintech &amp; Strategic Business Research</strong>
        </div>

        <div style="font-size: 11px; color: var(--muted); line-height: 1.5; border-top: 1px solid var(--line); padding-top: 10px; margin-top: 4px; opacity: 0.7;">
          <strong>Disclaimer:</strong> FinEngine is an open-source computation and simulation toolkit. Production accounting ledgers, statutory filings, and credit-scoring implementations should always be audited under applicable regulatory and accounting frameworks.
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
