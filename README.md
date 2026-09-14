# FinKernel / FinEngine Site Upgrade

This repository now behaves like a documentation-first JavaScript fintech flagship site instead of a static landing page.

## Default brand
The current default is **FinKernel** because it feels more distinctive than plain FinEngine while still sounding like a serious computation core.

### Brand switch rule
All visible brand labels are resolved from one file:
- `assets/js/brand.js`

If you want to switch back to **FinEngine** or move to another candidate later, start by editing the `SITE_BRAND` constant there.

## Vendored local libraries
For offline-safe opening from a downloaded zip, third-party JavaScript is stored locally:
- `assets/vendor/chart.umd.min.js` — Chart.js 4.4.3
- `assets/vendor/dayjs.min.js` — Day.js 1.11.13

No external CSS framework is used.

## JavaScript modules
- `assets/js/main.js`
- `assets/js/modules/theme.js`
- `assets/js/modules/nav.js`
- `assets/js/modules/reveal.js`
- `assets/js/modules/counters.js`
- `assets/js/modules/packages.js`
- `assets/js/modules/calculator.js`
- `assets/js/modules/copy.js`

## Package direction
- `@finkernel/core`
- `@finkernel/math`
- `@finkernel/ui`
- `@finkernel/pay`
- `@finkernel/reporting`
- `@finkernel/ledger`

## Suggested domain
- `finkernel.js.org`
