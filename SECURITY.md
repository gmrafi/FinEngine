# Security Policy

## Supported Versions

Currently, FinEngine is in pre-release (`0.x.x`). We apply security patches to the latest minor version. We recommend all users to stay on the most recent version available.

| Version | Supported          |
| ------- | ------------------ |
| 0.3.x   | :white_check_mark: |
| 0.2.x   | :white_check_mark: |
| < 0.2   | :x:                |

## Reporting a Vulnerability

As a financial computation engine, we take precision and security extremely seriously. If you discover a vulnerability or a mathematical calculation drift that could impact ledger integrity, please do not disclose it publicly.

**Please report it by emailing us at:**
[rafi@gmrafi.com.bd](mailto:rafi@gmrafi.com.bd) or [hello@finengine.js.org](mailto:hello@finengine.js.org) (or use GitHub Private Vulnerability Reporting).

### Response Timeline
- We will acknowledge receipt of your vulnerability report within 48 hours.
- We aim to provide a timeline for a fix within 5 days of acknowledgment.
- Once the issue is resolved and a patch is released, we will publish a coordinated security advisory.

### Scope
- **In Scope:** Mathematical calculation drift, improper handling of extreme financial bounds, UI component logic errors, and Cross-Site Scripting (XSS) vectors in `@finengine/ui`.
- **Out of Scope:** Issues relating to third-party build tools (unless they inject malicious code into the final bundle) and theoretical issues without a practical exploit path.

Thank you for helping keep the FinEngine ecosystem secure and mathematically sound!
