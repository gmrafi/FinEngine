<p align="center">
  <img src="https://raw.githubusercontent.com/gmrafi/FinEngine/main/.github/assets/finengine-logo-mark.png" alt="FinEngine logo" width="96" height="96" />
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gmrafi/FinEngine/main/.github/assets/finengine-banner-dark.png" />
    <img src="https://raw.githubusercontent.com/gmrafi/FinEngine/main/.github/assets/finengine-banner-light.png" alt="FinEngine" width="720" />
  </picture>
</p>

<p align="center"><strong>Documentation-first JavaScript finance tooling for lending math, ledger validation, analytics, and browser-local demos.</strong></p>

<p align="center">
  <a href="https://github.com/gmrafi/FinEngine/actions/workflows/pages.yml"><img alt="Pages" src="https://github.com/gmrafi/FinEngine/actions/workflows/pages.yml/badge.svg" /></a>
  <a href="https://github.com/gmrafi/FinEngine/actions/workflows/verify.yml"><img alt="Verify" src="https://github.com/gmrafi/FinEngine/actions/workflows/verify.yml/badge.svg" /></a>
  <a href="https://github.com/gmrafi/FinEngine/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/gmrafi/FinEngine" /></a>
  <a href="https://github.com/gmrafi/FinEngine/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/gmrafi/FinEngine" /></a>
</p>

<p align="center">
  <a href="#overview">Overview</a> ·
  <a href="#packages">Packages</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="#usage-example">Usage example</a> ·
  <a href="#live-surfaces">Live surfaces</a> ·
  <a href="#local-development">Local development</a>
</p>

## Overview

**FinEngine** is a documentation-first JavaScript finance toolkit for teams that need deterministic repayment math, ledger-safe validation, UI-ready finance view models, and credible open-source presentation in one place.

It is designed for product demos, internal tooling, education flows, repayment explainers, and browser-local financial workflows where consistency matters.

## Packages

| Package | Role | Highlights |
| --- | --- | --- |
| `@finengine/core` | Money primitives and accounting safety rails | `formatMoney`, `validateLedgerEntry`, `sumEntries` |
| `@finengine/math` | Lending and return calculations | `monthlyPayment`, `amortize`, `xirr` |
| `@finengine/ui` | UI-ready finance display models | `makeMoneyKpi`, `makeRepaymentSummary`, `makeSchedulePreview`, `makeLearningCards` |

### Roadmap surfaces shown in the docs site

- `@finengine/risk` — credit and enterprise risk helpers
- `@finengine/ratios` — financial ratio analysis and DuPont breakdowns
- `@finengine/microfinance` — flat vs declining repayment transparency

## Quick start

```bash
npm install
npm run verify:packages
```

## Usage example

```ts
import { amortize } from '@finengine/math'
import { makeMoneyKpi, makeRepaymentSummary } from '@finengine/ui'

const plan = amortize({ principal: 500000, annualRate: 13.5, months: 36 })

const emi = makeMoneyKpi('Monthly EMI', plan.monthlyPayment, 'SME working capital')
const summary = makeRepaymentSummary('SME working capital', plan, 85000, 1.5)
```

Expected output highlights:
- `emi.value` → `BDT 16,967.64`
- `summary.totalInterest` → `BDT 110,835.20`
- `summary.totalPayable` → `BDT 618,335.20`
- `summary.burdenLabel` → `Healthy burden · 20% of income`

## Live surfaces

- Homepage: https://gmrafi.github.io/FinEngine/
- Examples gallery: https://gmrafi.github.io/FinEngine/docs/examples/
- Core docs: https://gmrafi.github.io/FinEngine/docs/core/
- Math docs: https://gmrafi.github.io/FinEngine/docs/math/
- UI docs: https://gmrafi.github.io/FinEngine/docs/ui/
- Release checklist: https://gmrafi.github.io/FinEngine/docs/release/

## Local development

```bash
npm install
npm run check
npm run verify:packages
```

Key scripts:
- `npm run check` — JavaScript syntax checks for site modules
- `npm run build:packages` — builds `core`, `math`, and `ui`
- `npm run test:packages` — smoke tests for starter packages
- `npm run verify:packages` — full verification plus executed examples

## Repo structure

```text
assets/                 shared website assets and browser modules
  js/                   brand config, layout logic, playground logic
  vendor/               vendored runtimes used by the live demo
packages/
  core/                 money types and ledger validation
  math/                 repayment and return calculation helpers
  ui/                   finance-first UI view-model helpers
docs/                   package docs, examples, and release surfaces
```
