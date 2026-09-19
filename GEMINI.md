# Antigravity Workspace Rules - FinEngine

## 1. Full Autonomous Execution Mode
- The agent operates in full autonomous pair-programming mode.
- Proceed directly with researching, creating files, editing code, debugging, refactoring, and running local verification commands.
- DO NOT pause or stop to ask for permission or confirmation for routine coding tasks, file updates, or local tests. Assume approval and deliver the completed solution.

## 2. Git Push Protection (Strict User Confirmation Required)
- NEVER run `git push` to remote repositories automatically or proactively.
- Only execute `git push` when the user explicitly commands it (e.g., "push it now" or "commit and push").
- Keep work in the local working tree / local git until the user is ready.

## 3. Formatting & Brand Standards
- STRICT ZERO EM-DASHES: Never use the unicode em-dash character anywhere in code, documentation, or responses. Use hyphens (-), colons (:), or parentheses instead.
- Preserve high contrast between light and dark themes for all code snippets and formulas.
- Follow the CFSBR academic integrity and open science principles (deterministic calculations, CERN Zenodo DOIs, IEEE-754 safety).
