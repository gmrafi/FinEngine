/**
 * FinEngine Google Sheets Apps Script Add-on
 * Deterministic Financial Calculations & BDT Currency Formatting for Spreadsheets.
 *
 * How to install:
 * 1. In Google Sheets, click: Extensions -> Apps Script
 * 2. Paste this code into Code.gs
 * 3. Click Save (Disk icon). Return to your spreadsheet and use custom formulas!
 */

/**
 * Calculates exact monthly loan installment (EMI) under reducing balance.
 *
 * @param {number} principal Total loan principal amount (e.g. 50000).
 * @param {number} annualRate Annual interest rate as decimal or percentage (e.g. 0.09 or 9%).
 * @param {number} tenureMonths Total loan duration in months (e.g. 12).
 * @return {number} Exact monthly payment (EMI).
 * @customfunction
 */
function FINENGINE_EMI(principal, annualRate, tenureMonths) {
  var p = Number(principal);
  var r = Number(annualRate);
  if (r > 1) r = r / 100; // handle 9 as 9%
  r = r / 12;
  var n = Number(tenureMonths);

  if (p <= 0 || n <= 0) return 0;
  if (r === 0) return Math.round((p / n) * 100) / 100;

  var emi = (p * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi * 100) / 100;
}

/**
 * Calculates total interest payable over the lifetime of a reducing balance loan.
 *
 * @param {number} principal Total loan principal amount (e.g. 50000).
 * @param {number} annualRate Annual interest rate (e.g. 0.09 or 9%).
 * @param {number} tenureMonths Total loan duration in months (e.g. 12).
 * @return {number} Total cumulative interest amount.
 * @customfunction
 */
function FINENGINE_TOTAL_INTEREST(principal, annualRate, tenureMonths) {
  var emi = FINENGINE_EMI(principal, annualRate, tenureMonths);
  var n = Number(tenureMonths);
  var p = Number(principal);
  var totalPayable = emi * n;
  return Math.round((totalPayable - p) * 100) / 100;
}

/**
 * Formats a number with standard Bangladeshi Taka (BDT) Lakh and Crore grouping.
 *
 * @param {number} amount Financial amount (e.g. 12500000).
 * @param {boolean} [showSymbol=true] Whether to include "BDT " prefix.
 * @return {string} BDT formatted string (e.g. "BDT 1,25,00,000.00").
 * @customfunction
 */
function FINENGINE_BDT(amount, showSymbol) {
  var num = Number(amount);
  if (isNaN(num)) return amount;
  var isNegative = num < 0;
  var abs = Math.abs(num).toFixed(2);
  var parts = abs.split(".");
  var intPart = parts[0];
  var decPart = parts[1];

  var formatted = "";
  if (intPart.length <= 3) {
    formatted = intPart;
  } else {
    var lastThree = intPart.substring(intPart.length - 3);
    var remaining = intPart.substring(0, intPart.length - 3);
    var groups = [];
    for (var i = remaining.length; i > 0; i -= 2) {
      var start = Math.max(0, i - 2);
      groups.unshift(remaining.substring(start, i));
    }
    formatted = groups.join(",") + "," + lastThree;
  }

  var prefix = (showSymbol === false || showSymbol === "false") ? "" : "BDT ";
  return (isNegative ? "-" : "") + prefix + formatted + "." + decPart;
}

/**
 * Calculates annualized Internal Rate of Return (XIRR) for non-periodic cash flows.
 *
 * @param {Array} dates Range of cashflow dates (e.g. A2:A10).
 * @param {Array} amounts Range of cashflow amounts (e.g. B2:B10).
 * @return {number} Annualized rate of return (e.g. 0.28 for 28%).
 * @customfunction
 */
function FINENGINE_XIRR(dates, amounts) {
  var flatDates = Array.isArray(dates) ? dates.flat() : [dates];
  var flatAmounts = Array.isArray(amounts) ? amounts.flat() : [amounts];

  var cashflows = [];
  for (var i = 0; i < flatDates.length; i++) {
    if (flatDates[i] && flatAmounts[i] !== undefined && flatAmounts[i] !== "") {
      cashflows.push({
        date: new Date(flatDates[i]),
        amount: Number(flatAmounts[i]),
      });
    }
  }

  if (cashflows.length < 2) return 0;
  var d0 = cashflows[0].date.getTime();

  function xnpv(rate) {
    var total = 0;
    for (var j = 0; j < cashflows.length; j++) {
      var days = (cashflows[j].date.getTime() - d0) / (1000 * 60 * 60 * 24);
      total += cashflows[j].amount / Math.pow(1 + rate, days / 365.0);
    }
    return total;
  }

  function xnpvPrime(rate) {
    var total = 0;
    for (var j = 0; j < cashflows.length; j++) {
      var days = (cashflows[j].date.getTime() - d0) / (1000 * 60 * 60 * 24);
      total -= ((days / 365.0) * cashflows[j].amount) / Math.pow(1 + rate, days / 365.0 + 1);
    }
    return total;
  }

  var r = 0.1;
  for (var iter = 0; iter < 100; iter++) {
    var f = xnpv(r);
    var df = xnpvPrime(r);
    if (Math.abs(df) < 1e-12) break;
    var nextR = r - f / df;
    if (Math.abs(nextR - r) < 1e-7) {
      return Math.round(nextR * 10000) / 10000;
    }
    r = nextR;
  }
  return Math.round(r * 10000) / 10000;
}
