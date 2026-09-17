# Contributing to FinEngine

Thanks for contributing to **FinEngine**.

## What good contributions look like

FinEngine is trying to be credible in three areas at the same time:
1. **Financial correctness**
2. **Developer usability**
3. **Professional documentation quality**

Please keep all three in mind when opening issues or sending pull requests.

## Before you open a pull request

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run verification:
   ```bash
   npm run verify:packages
   ```
3. Check that docs, examples, and package APIs still match.
4. Keep changes focused. One concern per commit is preferred.

## Workspace overview

- `packages/core`  -  money and ledger primitives
- `packages/math`  -  EMI, amortization, and return logic
- `packages/ui`  -  UI-ready finance view models
- `docs/`  -  package docs, examples, and release guidance
- `assets/js/`  -  website and playground behavior

## Contribution standards

- Do not change financial formulas casually.
- If output values change, update the docs and executed examples.
- Prefer readable, typed APIs over clever abstractions.
- Keep the website looking like a serious product surface, not a rough demo.
- Preserve Bangladesh-aware learning examples where relevant.

## Pull request checklist

- [ ] Change is scoped clearly
- [ ] Verification passed locally
- [ ] Docs updated if API or behavior changed
- [ ] UI text and layout still read professionally
- [ ] No broken links introduced

## Need a starting point?

Open one of the issue forms in GitHub:
- Bug report
- Feature request
- Docs improvement
