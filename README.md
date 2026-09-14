# FinEngine

A developer-first fintech website and package-system concept for JavaScript, extended with real starter package skeletons and Bangladesh-aware finance education content.

## Active brand
- Public brand: **FinEngine**
- Internal switch token: `FINENGINE`
- Brand text is injected from `assets/js/brand.js`

## Vendored dependencies
All external runtime dependencies are stored locally for offline ZIP use:
- `assets/vendor/chart.umd.min.js` — Chart.js 4.4.3
- `assets/vendor/dayjs.min.js` — Day.js 1.11.13
- `assets/vendor/modern-normalize.min.css` — modern-normalize 2.0.0

## Workspace packages
- `packages/core` → `@finengine/core`
- `packages/math` → `@finengine/math`

Each package includes:
- scoped `package.json` with exports/types/publishConfig
- TypeScript source in `src/index.ts`
- README
- LICENSE
- smoke test
- built `dist/` output after verification

## Verified example outputs
### @finengine/core
- `formatMoney(125000)` → `BDT 125,000.00`
- `validateLedgerEntry(...)` on the included sample → `valid=true`, debit `5000`, credit `5000`

### @finengine/math
- `monthlyPayment(500000, 13.5, 36)` → `16967.64`
- `amortize(...)` total interest → `110835.2`
- `xirr(...)` sample → `0.28`

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

## Bangladesh context integrated
- BDT-denominated code examples
- Bangla-labeled learning path on the homepage
- Local finance education framing for MFS, SME cash flow, EMI, savings, and return reasoning

## Deployment
- GitHub Pages-ready static site
- `CNAME` points to `finengine.js.org`
