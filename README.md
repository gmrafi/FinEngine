# FinEngine

A developer-first fintech website and package-system concept for JavaScript, extended with starter packages and Bangladesh-aware finance education content.

## Live website
- Pages URL: https://gmrafi.github.io/FinEngine/
- Package docs section on homepage: https://gmrafi.github.io/FinEngine/#docs-api
- Bangladesh learning section: https://gmrafi.github.io/FinEngine/#bangladesh-learning
- Core docs page: https://gmrafi.github.io/FinEngine/docs/core/
- Math docs page: https://gmrafi.github.io/FinEngine/docs/math/
- UI docs page: https://gmrafi.github.io/FinEngine/docs/ui/
- Release checklist: https://gmrafi.github.io/FinEngine/docs/release/

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
- `packages/ui` → `@finengine/ui`

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

## Bangladesh context integrated
- BDT-denominated code examples
- Bangla-labeled learning path on the homepage
- Local finance education framing for MFS, SME cash flow, EMI, savings, and return reasoning

## Deployment
- GitHub Pages-ready static site
- Uses relative asset paths so everything works correctly under `/FinEngine/`

## Release workflow
- GitHub Actions verify workflow: `.github/workflows/verify.yml`
- Release checklist page: https://gmrafi.github.io/FinEngine/docs/release/
- Recommended publish order: `@finengine/core` → `@finengine/math` → `@finengine/ui`
