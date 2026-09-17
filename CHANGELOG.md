# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-09-17

### Added
- **Methodology Hub:** Introduced `/methodology/` for academic validation and IEEE-754 research.
- **Crossref & Zenodo:** Added DOIs and `CITATION.cff` for permanent academic archiving.
- **Simulation Lab:** Added dedicated `/simulation/` page with preset-driven simulators (student installment, SME working capital, merchant restock).
- **Playground:** Shipped in-browser VS Code Precision Playground with real-time audit card for IEEE-754 precision delta auditor.
- **UI Enhancements:** Dark/light mode zero-flash persistence and comprehensive mobile drawer navigation.

### Changed
- Refactored project into a monorepo structure with npm workspaces (`@finengine/core`, `@finengine/math`, `@finengine/ui`).
- Overhauled `README.md` to highlight architectural breakdown and zero-dependency ethos.
- Stripped `.html` from internal links to support clean URLs on GitHub Pages.

### Fixed
- Fixed methodology paper title wrapping on smaller desktop breakpoints.
- Resolved duplicate meta descriptions across standard HTML pages.
- Corrected footer broken links to governance files.

## [0.2.0] - 2026-08-20

### Added
- Interactive Loan Simulator with dynamic charts for EMI calculation on the homepage.
- Core packages setup (`core`, `math`, `ui`) in initial draft form.

### Fixed
- JavaScript floating point drift during iterative interest calculations.

## [0.1.0] - 2026-07-15

### Added
- Initial project structure and concept proving.
- Basic terminal morph animations.
- Proof of concept for client-side deterministic integer arithmetic.
