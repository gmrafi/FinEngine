# FinEngine Roadmap

Our vision is to provide a complete, zero-dependency, mathematically deterministic client-side financial computation engine. This roadmap outlines the current status and future direction of the project.

## Completed (v0.3.0)
- ✅ Core deterministic math engine (`@finengine/math`) avoiding IEEE-754 drift.
- ✅ BDT formatting primitives and core ledger validation (`@finengine/core`).
- ✅ Essential financial UI components (`@finengine/ui`).
- ✅ Interactive web simulators and VS Code-style precision playground.
- ✅ Academic archiving with CERN Zenodo and Crossref DOIs.
- ✅ Comprehensive documentation hub.

## In Progress (v0.4.0)
- 🚧 **@finengine/risk:** Basic client-side risk scoring models and credit burden checks.
- 🚧 **NPM Package Registry Publish:** Finalizing package metadata for public npm consumption.
- 🚧 **Enhanced Test Coverage:** Expanding the test suite for extreme edge cases in high-frequency trading contexts.

## Planned / Under Research (v1.0.0)
- 📅 **@finengine/microfinance:** Specialized logic for South Asian microfinance deduction rules, flat rates, and variable grace periods.
- 📅 **@finengine/ratios:** Financial statement ratio analysis primitives (Debt-to-Equity, Current Ratio) computed client-side.
- 📅 **@finengine/tax:** Modular tax deduction engines (e.g., NBR VAT logic).
- 📅 **Framework Wrappers:** Official React, Vue, and Svelte wrapper components for `@finengine/ui`.

## Community RFCs
We actively welcome community contributions for:
- Localization (adding precision formats for INR, PKR, LKR).
- Real-world settlement edge cases.
- Performance optimization of the math engine.

If you have a feature request, please open a discussion or use the Feature Request issue template!
