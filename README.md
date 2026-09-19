# FinEngine

<p align="center">
  <img src="brand-assets/finengine-canonical-mark.svg" alt="FinEngine logo" width="84" height="84" />
</p>

<h1 align="center">FinEngine</h1>

<p align="center">
  <strong>Deterministic financial math, IEEE-754 drift mitigation, and BDT-localized currency primitives for JavaScript and TypeScript.</strong>
</p>

<p align="center">
  <a href="https://doi.org/10.67226/cfsbr.fe.2026.001.v1"><img src="https://img.shields.io/badge/Crossref_DOI-10.67226%2Fcfsbr.fe.2026.001.v1-2273c3.svg" alt="Crossref DOI" /></a>
  <a href="https://doi.org/10.5281/zenodo.22769502"><img src="https://img.shields.io/badge/Zenodo_v0.3.0-10.5281%2Fzenodo.22769502-1F7A5C.svg" alt="CERN Zenodo Version DOI" /></a>
  <a href="https://doi.org/10.5281/zenodo.22769501"><img src="https://img.shields.io/badge/Zenodo_Concept-10.5281%2Fzenodo.22769501-1F7A5C.svg" alt="CERN Zenodo Concept DOI" /></a>
  <a href="https://finengine.js.org/"><img src="https://img.shields.io/badge/domain-finengine.js.org-2273c3.svg" alt="Verified Domain" /></a>
  <a href="https://github.com/gmrafi/FinEngine/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT%20%26%20CC--BY%204.0-blue.svg" alt="License" /></a>
  <a href="https://github.com/gmrafi/FinEngine/actions"><img src="https://img.shields.io/badge/verification-passing-brightgreen.svg" alt="Build Status" /></a>
  <a href="https://www.npmjs.com/org/finengine"><img src="https://img.shields.io/badge/npm-@finengine-cb3837?logo=npm" alt="npm Organization" /></a>
  <a href="https://pypi.org/project/finengine/"><img src="https://img.shields.io/badge/pypi-v0.1.0-3775A9?logo=pypi&logoColor=white" alt="PyPI Version" /></a>
  <a href="https://github.com/gmrafi/FinEngine-Py"><img src="https://img.shields.io/badge/GitHub-FinEngine--Py-181717?logo=github&logoColor=white" alt="FinEngine-Py Repository" /></a>
</p>

<p align="center">
  <a href="https://stackblitz.com/github/gmrafi/FinEngine?file=examples/quickstart.ts"><img src="https://img.shields.io/badge/StackBlitz-Open_TypeScript_Sandbox-1389FD?logo=stackblitz&logoColor=white" alt="Open in StackBlitz" /></a>
  <a href="https://colab.research.google.com/github/gmrafi/FinEngine/blob/main/examples/finengine_quickstart.ipynb"><img src="https://img.shields.io/badge/Google_Colab-Open_Python_Notebook-F9AB00?logo=googlecolab&logoColor=white" alt="Open in Colab" /></a>
  <a href="examples/mcp-server/"><img src="https://img.shields.io/badge/MCP_Server-Claude_%26_Cursor_Tools-10B981?logo=anthropic&logoColor=white" alt="MCP Server for AI Agents" /></a>
  <a href="examples/google-sheets/"><img src="https://img.shields.io/badge/Google_Sheets-Custom_Formulas-34A853?logo=googlesheets&logoColor=white" alt="Google Sheets Add-on" /></a>
  <a href="https://cdn.jsdelivr.net/npm/@finengine/math@0.3.0/+esm"><img src="https://img.shields.io/badge/jsDelivr-CDN_ESM_Module-E84D3D?logo=jsdelivr&logoColor=white" alt="jsDelivr CDN" /></a>
</p>

<p align="center">
  <a href="https://www.producthunt.com/products/finengine?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-finengine" target="_blank" rel="noopener noreferrer">
    <img alt="FinEngine on Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1251701&theme=light" />
  </a>
</p>

<p align="center">
  <a href="#key-guarantees">Key Guarantees</a> &middot;
  <a href="#monorepo-packages">Packages</a> &middot;
  <a href="#ai-agent--llm-integrations-mcp-function-calling">AI Agents &amp; MCP</a> &middot;
  <a href="#spreadsheet-integrations-google-sheets--excel">Google Sheets</a> &middot;
  <a href="#python-sdk--quant-finance">Python SDK</a> &middot;
  <a href="#installation">Installation</a> &middot;
  <a href="#quickstart-examples">Quickstart</a> &middot;
  <a href="#live-interactive-surfaces">Live Tools</a> &middot;
  <a href="#academic-backing--citation">Citation</a>
</p>

---

> [!NOTE]
> **Project Status & Architectural Scope: Developer Preview (v0.x)**
> FinEngine provides verified, deterministic financial primitives (integer sub-unit money arithmetic, actuarial reducing-balance loan amortization, international day-count conventions, and hybrid robust XIRR solvers). Higher-level machine learning and credit risk scoring modules (`finengine.ai`) are currently positioned as **Research Scaffolds & Baseline Heuristics** under the CFSBR Lab roadmap. FinEngine is an open-source library for developers and researchers, not a regulated credit rating agency or monolithic core banking replacement.

## Why FinEngine?

Modern web and mobile financial applications increasingly offload real-time calculations to client-side runtimes. However, standard ECMAScript engines rely on IEEE-754 double-precision binary floating-point arithmetic (`binary64`), introducing representation drift in everyday decimal arithmetic:

```js
0.1 + 0.2 === 0.30000000000000004; // Drift detected
```

In multi-period loan amortization schedules, interest compounding, and balance ledgers, this drift compounds non-linearly across time horizons, causing final closing balances to fail to liquidate cleanly to zero (`B_n !== 0.00`).

**FinEngine** solves this by establishing a zero-dependency, deterministic integer-scaled arithmetic architecture with native support for South Asian currency conventions (Bangladeshi Taka &middot; Poisha) and client-side privacy.

---

## Key Guarantees

- **Zero Float Drift:** Replaces binary floating-point representation with integer-scaled monetary sub-unit arithmetic (Poisha: 1 BDT = 100 Poisha).
- **Terminal Reconciliation Rule:** Mathematical boundary enforcement guaranteeing the closing principal balance liquidates identically to zero (`B_n === 0.00`).
- **Actuarial Loan Amortization:** True reducing-balance Equated Monthly Installment (EMI) schedules with monthly principal and interest splits.
- **Advanced Financial Solvers:** Constrained Newton-Raphson solvers with binary bisection fallbacks for non-periodic cashflow internal rate of return (XIRR) and debt-burden ratio (DBR) stress testing.
- **South Asian Numbering Primitives:** Built-in Lakh and Crore grouping (`2,45,87,500.00`) alongside ISO standard formatting.
- **100% Client-Side Privacy:** Zero-knowledge computing; financial values and customer schedules never leave the host browser.
- **Academic & Audit Permanence:** Permanent archival on CERN Zenodo and indexed with permanent Crossref DOIs.

---

## Monorepo Packages

FinEngine is architected as an offline-capable monorepo dividing mathematical precision from presentation:

| Package                                               | Version | Registry | Purpose                                                                                                 | Key Exports                                                       |
| :---------------------------------------------------- | :-----: | :------: | :------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------- |
| [`@finengine/core`](packages/core/)                   | `0.3.0` |  `npm`   | Integer sub-unit arithmetic, BDT currency primitives, and double-entry ledger balance validators.       | `createMoney`, `formatMoney`, `validateLedgerEntry`, `sumEntries` |
| [`@finengine/math`](packages/math/)                   | `0.3.0` |  `npm`   | Actuarial reducing-balance loan amortization, EMI schedules, and Newton-Raphson XIRR solvers.           | `amortize`, `monthlyPayment`, `xirr`                              |
| [`@finengine/ui`](packages/ui/)                       | `0.3.0` |  `npm`   | Accessible, unstyled UI view-models for repayment summaries, debt burden gauges, and schedule previews. | `makeMoneyKpi`, `makeRepaymentSummary`, `makeSchedulePreview`     |
| [`finengine`](https://github.com/gmrafi/FinEngine-Py) | `0.1.0` |  `PyPI`  | Python actuarial math, integer Poisha scaling, Pandas DataFrames, and alternative credit risk AI.       | `amortize`, `to_dataframe`, `xirr`, `assess_credit_risk`          |

### Research Pipeline (CFSBR Lab)

- `@finengine/risk`: Localized algorithmic scoring matrices for informal and thin-file borrower profiles.
- `@finengine/microfinance`: Actuarial translation modules converting flat interest structures into true reducing APR.
- `@finengine/ratios`: Deterministic financial ratio engines for working capital liquidity and DuPont decomposition.
- `@finengine/tax`: NBR-compliant TDS/VDS and corporate tax calculation primitives.

---

## AI Agent &amp; LLM Integrations (MCP &amp; Function Calling)

FinEngine provides zero-hallucination execution tools for autonomous financial agents, Claude Desktop, Cursor IDE, and OpenAI/Gemini models:

### 1. Model Context Protocol (MCP) Server for Claude &amp; Cursor

Connect FinEngine directly to **Claude Desktop** or **Cursor IDE** via Model Context Protocol:

```json
// Add to Claude Desktop claude_desktop_config.json or .cursor/mcp.json
{
  "mcpServers": {
    "finengine": {
      "command": "npx",
      "args": ["-y", "@finengine/mcp-server"]
    }
  }
}
```

- **Tools Included:** `calculate_amortization`, `calculate_xirr`, `format_bdt_currency`, `assess_credit_risk`.
- **Directory & Quickstart:** [`examples/mcp-server/`](examples/mcp-server/)

### 2. LangChain &amp; LlamaIndex Python Tool Wrapper

```python
from langchain.tools import tool
from finengine.math import calculate_amortization

@tool
def finengine_amortize(principal: float, annual_rate: float, tenure_months: int) -> dict:
    """Deterministic loan amortization and repayment schedule generator."""
    plan = calculate_amortization(principal=principal, annual_rate=annual_rate, tenure_months=tenure_months)
    return {"monthly_payment": plan.monthly_payment, "total_interest": plan.total_interest}
```

- **Full AI Lab & Function Calling Schemas:** [https://finengine.js.org/ai/](https://finengine.js.org/ai/)

---

## Spreadsheet Integrations (Google Sheets &amp; Excel)

Bring deterministic financial math and Bangladeshi Taka (BDT) Lakh/Crore formatting directly into spreadsheet workbooks:

```excel
=FINENGINE_EMI(500000, 9%, 36)            // Output: 15899.86
=FINENGINE_TOTAL_INTEREST(500000, 9%, 36) // Output: 72394.96
=FINENGINE_BDT(12500000)                  // Output: "BDT 1,25,00,000.00"
=FINENGINE_XIRR(A2:A10, B2:B10)           // Output: 0.2845 (28.45%)
```

- **Installation:** Paste [`examples/google-sheets/FinEngine.gs`](examples/google-sheets/FinEngine.gs) into Google Sheets (**Extensions** &rarr; **Apps Script**).
- **Documentation:** [`examples/google-sheets/README.md`](examples/google-sheets/)

---

## Python SDK &amp; Quant Finance (`finengine` on PyPI)

FinEngine is published as an audited, zero-dependency Python library for quantitative finance, data scientists, and backend banking systems.

```bash
# 1. Minimal installation (Zero dependencies, 100% pure math)
pip install finengine

# 2. With Pandas & NumPy DataFrame support
pip install "finengine[analysis]"

# 3. Full suite with AI & alternative credit risk models
pip install "finengine[all]"
```

### Python Quickstart (Amortization &amp; Pandas Integration)

```python
from finengine import amortize, format_money, to_dataframe

# 1. Compute 36-month SME loan schedule with guaranteed terminal zero balance
plan = amortize(principal=500000, annual_rate=13.5, months=36)
print(f"Monthly Payment: {format_money(plan.monthly_payment, 'BDT')}")
# → Monthly Payment: BDT 16,967.64

# 2. Direct conversion into structured Pandas DataFrame
df = to_dataframe(plan)
print(df.head())
#    month   payment  principal_paid  interest  remaining_balance
# 0      1  16967.64        11342.64   5625.00          488657.36
# 1      2  16967.64        11470.25   5497.39          477187.11
```

- **PyPI Registry:** [https://pypi.org/project/finengine/](https://pypi.org/project/finengine/)
- **Python GitHub Repository:** [https://github.com/gmrafi/FinEngine-Py](https://github.com/gmrafi/FinEngine-Py)
- **Interactive Python Documentation:** [https://finengine.js.org/python/](https://finengine.js.org/python/)

---

## Installation

Install foundational packages via npm, yarn, or pnpm:

```bash
# Install all three foundational packages
npm install @finengine/core @finengine/math @finengine/ui

# Or install individually
npm install @finengine/core
npm install @finengine/math
npm install @finengine/ui
```

### CDN / Direct Browser Usage (Zero Toolchain)

You can import FinEngine directly into vanilla HTML applications without a bundler:

```html
<script type="module">
  import { amortize } from "https://cdn.jsdelivr.net/gh/gmrafi/FinEngine@main/packages/math/dist/index.js";
  import { formatMoney } from "https://cdn.jsdelivr.net/gh/gmrafi/FinEngine@main/packages/core/dist/index.js";

  const plan = amortize({ principal: 500000, annualRate: 13.5, months: 36 });
  console.log(formatMoney(plan.monthlyPayment, "BDT")); // "BDT 16,967.64"
</script>
```

---

## Quickstart Examples

### 1. Eliminating Floating-Point Drift

```ts
import { createMoney, formatMoney } from "@finengine/core";

// Standard JS drift: 0.1 + 0.2 === 0.30000000000000004
const itemA = createMoney(0.1, "BDT");
const itemB = createMoney(0.2, "BDT");

const total = createMoney(itemA.amount + itemB.amount, "BDT");
console.log(total.amount); // 0.3
console.log(formatMoney(total.amount, "BDT")); // "BDT 0.30"
```

### 2. Computing a Deterministic 36-Month Loan Amortization

```ts
import { amortize, monthlyPayment } from "@finengine/math";
import { formatMoney } from "@finengine/core";

const principal = 500000; // BDT 5,00,000 (5 Lakh)
const annualRate = 13.5; // 13.5% per annum
const months = 36; // 3-year tenure

const plan = amortize({ principal, annualRate, months });

console.log("Monthly EMI:", formatMoney(plan.monthlyPayment, "BDT"));
// → "Monthly EMI: BDT 16,967.64"

console.log("Total Interest:", formatMoney(plan.totalInterest, "BDT"));
// → "Total Interest: BDT 110,835.20"

console.log("Final Month Balance:", plan.schedule[35].remainingBalance);
// → 0 (Guaranteed zero closure via Terminal Reconciliation Rule)
```

### 3. Double-Entry Ledger Validation

```ts
import { validateLedgerEntry } from "@finengine/core";

const entry = {
  reference: "TX-2026-0042",
  currency: "BDT",
  lines: [
    { account: "1010-CASH", side: "debit", amount: 50000 },
    { account: "2010-LOAN-DISBURSEMENT", side: "credit", amount: 50000 },
  ],
};

const audit = validateLedgerEntry(entry);
console.log(audit.valid); // true
console.log(audit.errors); // []
```

### 4. UI Dashboard Primitives & Borrower Burden

```ts
import { amortize } from "@finengine/math";
import { makeMoneyKpi, makeRepaymentSummary } from "@finengine/ui";

const plan = amortize({ principal: 500000, annualRate: 13.5, months: 36 });
const borrowerIncome = 85000; // Monthly income in BDT

const emiKpi = makeMoneyKpi(
  "Monthly EMI",
  plan.monthlyPayment,
  "SME working capital",
);
const summary = makeRepaymentSummary(
  "SME working capital",
  plan,
  borrowerIncome,
  1.5,
);

console.log(summary.burdenLabel); // "Healthy burden · 20% of income"
console.log(summary.burdenTone); // "healthy"
```

---

## Live Interactive Surfaces

Explore FinEngine live in your browser:

- **Flagship Portal:** [https://finengine.js.org/](https://finengine.js.org/)
- **Python SDK & Quant Hub:** [https://finengine.js.org/python/](https://finengine.js.org/python/)
- **Live Loan Simulator:** [https://finengine.js.org/#interactive-simulator](https://finengine.js.org/#interactive-simulator)
- **VS Code Precision Playground:** [https://finengine.js.org/#precision-playground](https://finengine.js.org/#precision-playground) (Test recipes and custom calculations in-browser with zero latency)
- **Full Simulation Lab:** [https://finengine.js.org/simulation/](https://finengine.js.org/simulation/)
- **Technical Working Paper (Methodology):** [https://finengine.js.org/methodology/](https://finengine.js.org/methodology/)
- **API Documentation:** [https://finengine.js.org/docs/](https://finengine.js.org/docs/)

---

## Local Development & Testing

Clone the repository and run verification checks locally:

```bash
# Clone the repository
git clone https://github.com/gmrafi/FinEngine.git
cd FinEngine

# Install dependencies (TypeScript toolchain)
npm install

# Run static syntax checks across all site and package modules
npm run check

# Build all three foundational packages
npm run build:packages

# Run package smoke tests
npm run test:packages

# Run end-to-end package verification with executable examples
npm run verify:packages
```

### Available Scripts

- `npm run check`: Runs Node.js syntax validation on all modules.
- `npm run build:packages`: Compiles TypeScript for `@finengine/core`, `@finengine/math`, and `@finengine/ui`.
- `npm run test:packages`: Executes smoke test suites for each package.
- `npm run verify:packages`: End-to-end pipeline: builds, tests, and runs executable demo verification scripts.

---

## Academic Backing & Citation

FinEngine is published as an open computational methodology standard by the **Centre for Fintech and Strategic Business Research (CFSBR)**.

### APA 7th Edition

> Rafi, M. G. M. (2026). _FinEngine: A Deterministic Computational Framework for Client-Side Financial Interfaces_ (CFSBR Technical Working Paper No. CFSBR-FE-2026-001). Centre for Fintech and Strategic Business Research. https://doi.org/10.67226/cfsbr.fe.2026.001.v1

### BibTeX (Working Paper)

```bibtex
@techreport{rafi2026finengine,
  author      = {Rafi, Md Golam Mubasshir},
  title       = {FinEngine: A Deterministic Computational Framework for Client-Side Financial Interfaces},
  institution = {Centre for Fintech and Strategic Business Research (CFSBR)},
  year        = {2026},
  month       = {September},
  type        = {Technical Working Paper},
  number      = {CFSBR-FE-2026-001},
  doi         = {10.67226/cfsbr.fe.2026.001.v1},
  url         = {https://finengine.js.org/methodology/}
}
```

### BibTeX (Software Archive · CERN Zenodo)

```bibtex
@software{finengine_core_v030,
  author    = {Rafi, Md Golam Mubasshir},
  title     = {gmrafi/FinEngine: FinEngine v0.3.0: The Deterministic Financial Engine Release},
  year      = {2026},
  publisher = {Zenodo},
  version   = {v0.3.0},
  doi       = {10.5281/zenodo.22769502},
  url       = {https://doi.org/10.5281/zenodo.22769502}
}
```

---

## Archival Identifiers

- **Methodology DOI (Crossref):** [10.67226/cfsbr.fe.2026.001.v1](https://doi.org/10.67226/cfsbr.fe.2026.001.v1)
- **Software Version DOI (Zenodo):** [10.5281/zenodo.22769502](https://doi.org/10.5281/zenodo.22769502)
- **Software Concept DOI (Zenodo All Versions):** [10.5281/zenodo.22769501](https://doi.org/10.5281/zenodo.22769501)
- **Software Heritage ID:** `swh:1:dir:4da6366919f478fd431b2f9ce1d342620cc8834f`

---

## License

- **Software Code:** [MIT License](LICENSE) &copy; 2026 Md Golam Mubasshir Rafi / FinEngine Labs.
- **Documentation & Research Methodology:** [Creative Commons Attribution 4.0 International (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
