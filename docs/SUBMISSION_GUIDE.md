# FinEngine Global Submission & Directory Guide

This guide contains pre-formatted submission templates, direct URLs, and step-by-step instructions for submitting FinEngine to curated global lists, security audits, and academic registries.

---

## 1. Awesome Lists Submissions

### A. Awesome Fintech (`dkhundley/awesome-fintech`)
* **Repository URL**: https://github.com/dkhundley/awesome-fintech
* **Target Section**: Under `Libraries & Frameworks` or `Financial Math`
* **Entry to Add**:
```markdown
* [FinEngine](https://finengine.js.org) - Deterministic financial math and loan amortization engine for JavaScript and Python with zero external runtime dependencies.
```
* **PR Title**: `Add FinEngine to Libraries / Financial Math`
* **PR Description**:
```markdown
FinEngine is a zero-dependency deterministic financial computing engine providing IEEE-754 precision math, reducing-balance loan amortization, compound schedules, and MFS thin-file credit risk modeling. Available on npm (@finengine/core, @finengine/math, @finengine/ui) and PyPI (finengine).
```

---

### B. Awesome Python (`vinta/awesome-python`) / Awesome Quant (`wilsonfreitas/awesome-quant`)
* **Repository URL**: https://github.com/wilsonfreitas/awesome-quant
* **Target Section**: Under `Financial Instruments and Pricing` or `Python`
* **Entry to Add**:
```markdown
* [FinEngine Python](https://github.com/gmrafi/FinEngine-Py) - Zero-dependency quantitative financial calculation library with pure math primitives, loan amortization schedules, and Pandas DataFrame integration.
```
* **PR Title**: `Add FinEngine Python to Financial Instruments`

---

### C. Awesome Node.js (`sindresorhus/awesome-nodejs`)
* **Repository URL**: https://github.com/sindresorhus/awesome-nodejs
* **Target Section**: Under `Finance` or `Math`
* **Entry to Add**:
```markdown
* [FinEngine](https://github.com/gmrafi/FinEngine) - Institutional-grade, zero-dependency financial computation engine with strict BDT / global currency rounding and double-entry validation.
```

---

## 2. OpenSSF Best Practices Badge Setup

1. Visit **OpenSSF Best Practices Portal**: https://bestpractices.coreinfrastructure.org/en
2. Click **Log In** with your GitHub account (`gmrafi`).
3. Click **Add New Project** and select `gmrafi/FinEngine`.
4. Answer the self-certification questions (Open Source License: MIT, Version Control: Git, Automated Tests: Present, Security Policy: Present).
5. Once submitted, add the generated badge markdown to `README.md`:
```markdown
[![OpenSSF Best Practices](https://bestpractices.coreinfrastructure.org/projects/<PROJECT_ID>/badge)](https://bestpractices.coreinfrastructure.org/projects/<PROJECT_ID>)
```

---

## 3. Papers With Code Submission

* **Portal URL**: https://paperswithcode.com
* **Paper Title**: Computational Financial Primitives & Real-Time Financial Literacy in Emerging Markets: The FinEngine Paradigm
* **Zenodo DOI**: 10.5281/zenodo.18844837
* **Code Repository**: https://github.com/gmrafi/FinEngine
* **Category**: Computational Finance, AI for Economic Empowerment
