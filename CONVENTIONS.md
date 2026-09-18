# FinEngine Autonomous Agent Conventions & Architectural Boundaries

This document defines the strict operational rules, architectural boundaries, and implementation guidelines for all autonomous AI agents (Kilo Gas Town, Polecats, Refinery, Mayor) working on the FinEngine repository.

---

## 1. Strict Security & Repository Boundaries

1. **AI Scope Exclusivity:**
   * All modifications, additions, and refactoring MUST be strictly confined to the AI & Quantitative Models Lab page (`ai/index.html`), its dedicated JavaScript modules (`assets/js/modules/ai-*.js`), and relevant styling in `styles.css`.
2. **Forbidden Core Directories (NEVER TOUCH):**
   * DO NOT modify, refactor, or delete files inside `packages/@finengine/core`, `packages/@finengine/math`, `packages/@finengine/ui`, or `packages/`.
   * DO NOT modify root `index.html` (the JavaScript Core Homepage).
   * DO NOT modify GitHub Actions workflows in `.github/workflows/`.
   * DO NOT touch root `package.json` dependencies without human approval.
3. **Branch & PR Policy:**
   * Work exclusively on `feature/ai-interactive-playground` or temporary convoy feature branches.
   * All changes must land via a clean Pull Request for human review. Direct pushes to `main` are strictly forbidden.

---

## 2. Technical Stack & Coding Standards

1. **Vanilla ES Modules & Zero Heavy Dependencies:**
   * FinEngine frontend is built with ultra-fast, zero-dependency native ES modules.
   * Do not install external npm UI packages or heavy bundle frameworks (like React/Vue) on the static site.
   * Write modular JavaScript with standard `export function init...()` patterns.
2. **Deterministic Mathematical Principles:**
   * All client-side calculators must be deterministic, transparent, and robust.
   * Use integer sub-unit rounding (paisa / cents) where monetary totals are calculated.
3. **Design & Aesthetic System:**
   * Match FinEngine's institutional dark/light aesthetic (Slate #0f172a, Emerald #10b981, Sky Blue #38bdf8, Indigo #6366f1, Amber #f59e0b).
   * Support both `html[data-theme='dark']` and `html[data-theme='light']`.
   * Maintain 100% mobile responsiveness (CSS Grid / Flexbox).
   * Use smooth CSS transitions and accessible form labels/ARIA attributes.

---

## 3. The 4 Research Pillars of FinEngine AI & Feature Roadmap

All interactive widgets on `ai/index.html` must map to these 4 official Center for Financial Software & Banking Research (CFSBR) pillars:

### Pillar 1: Alternative Credit Risk & Thin-File MFS Scoring Matrix (@finengine/risk)
* **Feature 1.1: Interactive MFS Credit Risk Simulator** (Sliders for Inflow, Outflow, Avg Balance, Frequency, Utility Consistency, Account Age -> Score 300-850, PD %, Risk Tier, Credit Exposure).
* **Feature 1.2: Feature Importance & Explainability Radar/Bar** (Visual breakdown showing why a credit score increased or decreased based on cash-flow health vs bill discipline).
* **Feature 1.3: Dynamic Python API Generator with 1-Click Copy** (Live-syncing `finengine.ai.MFSProfile` code snippet matching slider inputs).

### Pillar 2: Microfinance Transparency & Flat-to-Reducing Neural Converter (@finengine/microfinance)
* **Feature 2.1: Disguised Flat-to-Reducing APR Visualizer** (Input nominal flat rate and installment count -> computes true statutory reducing APR).
* **Feature 2.2: Repayment Burden & Over-Indebtedness Meter** (Displays installment-to-income ratio with healthy vs distressed visual zones).
* **Feature 2.3: Microfinance Ethical Disclosure Card** (Generates standardized borrower truth-in-lending summary in BDT).

### Pillar 3: Autonomous Banking Agent Runtime & Double-Entry Ledger Verifier (@finengine/agents)
* **Feature 3.1: Multi-Agent Ledger Sanity Checker Simulator** (Simulates automated debit/credit balancing, float drift detection, and discrepancy alerting).
* **Feature 3.2: Liquidity Buffer Runway Estimator** (Calculates working capital depletion under varying cash-in/out velocity).

### Pillar 4: Synthetic Macro-Shock Simulation & Portfolio Contagion (@finengine/stress)
* **Feature 4.1: Synthetic Portfolio Shock Matrix** (Simulate default contagion under inflation spikes, interest rate shifts, and liquidity drought).
* **Feature 4.2: VaR (Value at Risk) & Expected Shortfall Preview** (Interactive 95% / 99% portfolio confidence bounds).

---

## 4. Verification & Quality Assurance

Before submitting any bead or convoy for refinery review, ensure:
1. Syntax check passes: `npm run check`.
2. No broken layout or unclosed HTML tags.
3. Interactive inputs have both `input` and `change` event listeners.
4. All copy buttons provide visual "Copied! ✓" feedback.
