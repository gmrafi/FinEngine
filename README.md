# FinEngine

[![Pages](https://github.com/gmrafi/FinEngine/actions/workflows/pages.yml/badge.svg)](https://github.com/gmrafi/FinEngine/actions/workflows/pages.yml)
[![Verify](https://github.com/gmrafi/FinEngine/actions/workflows/verify.yml/badge.svg)](https://github.com/gmrafi/FinEngine/actions/workflows/verify.yml)
[![License](https://img.shields.io/github/license/gmrafi/FinEngine)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/gmrafi/FinEngine)](https://github.com/gmrafi/FinEngine/commits/main)

**FinEngine** is a documentation-first JavaScript finance toolkit for teams that need lending math, money formatting, ledger validation, UI-ready view models, and Bangladesh-aware product education in one credible open-source surface.

## Why this repo exists

Most finance demos look good until they need exact repayment math, deterministic ledger checks, or user-facing numbers that still read clearly in product UI. FinEngine is built to close that gap.

It combines:
- **`@finengine/core`** for money primitives and ledger-safe validation
- **`@finengine/math`** for EMI, amortization, and return calculations
- **`@finengine/ui`** for finance-first display models and learning-oriented UI helpers
- **A live GitHub Pages docs site** with package docs, examples, and an interactive browser demo

## Live surfaces

- **Homepage:** https://gmrafi.github.io/FinEngine/
- **Examples gallery:** https://gmrafi.github.io/FinEngine/docs/examples/
- **Core docs:** https://gmrafi.github.io/FinEngine/docs/core/
- **Math docs:** https://gmrafi.github.io/FinEngine/docs/math/
- **UI docs:** https://gmrafi.github.io/FinEngine/docs/ui/
- **Release checklist:** https://gmrafi.github.io/FinEngine/docs/release/

## Quick install

```bash
npm install @finengine/core @finengine/math @finengine/ui
```

## Quick example

```ts
import { amortize } from '@finengine/math'
import { makeMoneyKpi, makeRepaymentSummary } from '@finengine/ui'

const plan = amortize({ principal: 500000, annualRate: 13.5, months: 36 })

const emi = makeMoneyKpi('Monthly EMI', plan.monthlyPayment, 'SME working capital')
const summary = makeRepaymentSummary('SME working capital', plan, 85000, 1.5)
```

Expected output highlights:
- `emi.value` → `BDT 16,967.64`
- `summary.totalInterest` → `BDT 110,835.20`
- `summary.totalPayable` → `BDT 618,335.20`
- `summary.burdenLabel` → `Healthy burden · 20% of income`

## Packages

| Package | Purpose | Highlights |
| --- | --- | --- |
| `@finengine/core` | Money primitives and accounting safety rails | `formatMoney`, `validateLedgerEntry`, `sumEntries` |
| `@finengine/math` | Lending and return calculations | `monthlyPayment`, `amortize`, `xirr` |
| `@finengine/ui` | UI-ready finance display models | `makeMoneyKpi`, `makeRepaymentSummary`, `makeSchedulePreview`, `makeLearningCards` |

## Local development

```bash
npm install
npm run verify:packages
```

Key workspace scripts:
- `npm run check` — site JavaScript syntax checks
- `npm run build:packages` — builds `core`, `math`, and `ui`
- `npm run test:packages` — runs smoke tests for the starter packages
- `npm run verify:packages` — full verification plus executed examples

## Repo structure

```text
assets/                 shared website assets and browser modules
  js/                   brand config, layout logic, playground logic
  vendor/               locally vendored runtime dependencies
docs/                   package docs, examples, and release guides
packages/
  core/                 @finengine/core
  math/                 @finengine/math
  ui/                   @finengine/ui
scripts/                verification helpers and executed example scripts
```

## Open-source credibility

- GitHub Pages-ready static site with relative asset paths
- Local vendored runtime dependencies for offline-safe review
- GitHub Actions verification workflow for syntax, builds, tests, and examples
- Package docs written against executed examples instead of placeholder prose

## Community and contribution

- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Issue templates: `.github/ISSUE_TEMPLATE/`
- Pull request checklist: `.github/pull_request_template.md`

## Release flow

Publish order:
1. `@finengine/core`
2. `@finengine/math`
3. `@finengine/ui`

Release reference:
- https://gmrafi.github.io/FinEngine/docs/release/

## License

MIT — see [LICENSE](LICENSE)
