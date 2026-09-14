# FinEngine

A developer-first fintech website and package-system concept for JavaScript.

## Default brand
- Active public brand: **FinEngine**
- Internal switch token: `FINENGINE`
- Brand text is injected from `assets/js/brand.js`

## Vendored dependencies
All external runtime dependencies are stored locally for offline ZIP use:
- `assets/vendor/chart.umd.min.js` — Chart.js 4.4.3
- `assets/vendor/dayjs.min.js` — Day.js 1.11.13
- `assets/vendor/modern-normalize.min.css` — modern-normalize 2.0.0

## JavaScript modules
- `assets/js/main.js`
- `assets/js/brand.js`
- `assets/js/modules/nav.js`
- `assets/js/modules/reveal.js`
- `assets/js/modules/counters.js`
- `assets/js/modules/packages.js`
- `assets/js/modules/copy.js`
- `assets/js/modules/theme.js`
- `assets/js/modules/calculator.js`
- `assets/js/modules/form.js`

## Site behaviors
- Scroll spy navigation
- Reveal animations
- Animated counters
- Tabbed package explorer
- Accordion sections
- Clipboard copy helper
- Theme toggle
- EMI calculator + amortization chart
- Collaboration form validation

## Deployment
- GitHub Pages-ready static site
- `CNAME` points to `finengine.js.org`


## Public-site note
Internal launch checklists and naming debates should stay out of the public homepage. Public-facing pages should show packages, examples, docs behavior, and working JavaScript demos.
