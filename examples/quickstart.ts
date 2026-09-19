/**
 * FinEngine TypeScript / JavaScript One-Click Quickstart
 * Run directly in StackBlitz or Node.js runtime.
 */

import { calculateEMI, calculateAmortization, xirr } from "@finengine/math";
import { formatBDT, PoishaMoney } from "@finengine/core";

console.log("=== FinEngine Deterministic Math Quickstart ===\n");

// 1. Integer Sub-unit Money Arithmetic (Zero Float-Drift)
const walletA = PoishaMoney.fromBDT(1250.50); // 125,050 poisha
const walletB = PoishaMoney.fromBDT(249.50);  // 24,950 poisha
const total = walletA.add(walletB);

console.log("Wallet A:    ", walletA.format());
console.log("Wallet B:    ", walletB.format());
console.log("Total Money: ", total.format()); // Exactly BDT 1,500.00 without 0.0000000000004 drift!

// 2. Reducing-Balance EMI Amortization
const principal = 500000; // BDT 500,000 SME loan
const annualRate = 0.09;  // 9.0% statutory annual rate
const tenureMonths = 24;  // 24 months tenure

const emi = calculateEMI({ principal, annualRate, tenureMonths });
console.log("\nMonthly EMI: ", formatBDT(emi));

const schedule = calculateAmortization({ principal, annualRate, tenureMonths });
console.log("First Month Principal Paid:", formatBDT(schedule[0].principal));
console.log("First Month Interest Paid: ", formatBDT(schedule[0].interest));
console.log("Final Closing Balance:     ", formatBDT(schedule[schedule.length - 1].balance));

// 3. Hybrid Bracketed XIRR Solver
const cashflows = [
  { amount: -500000, date: "2026-01-01" },
  { amount: 120000,  date: "2026-04-01" },
  { amount: 150000,  date: "2026-07-01" },
  { amount: 180000,  date: "2026-10-01" },
  { amount: 200000,  date: "2027-01-01" },
];

const irrResult = xirr(cashflows);
console.log("\nPortfolio Annualized XIRR:", (irrResult.rate * 100).toFixed(2) + "%");
console.log("XIRR Solved in:", irrResult.iterations, "iterations (Status:", irrResult.converged ? "Converged" : "Diverged", ")");
