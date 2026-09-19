#!/usr/bin/env node
/**
 * FinEngine Model Context Protocol (MCP) Server
 * Zero-dependency JSON-RPC 2.0 stdio server for LLM agent integration.
 * Supported by Claude Desktop, Cursor, Antigravity, and autonomous financial agents.
 */

import * as readline from "node:readline";

const SERVER_NAME = "finengine-mcp-server";
const SERVER_VERSION = "0.3.0";
const PROTOCOL_VERSION = "2024-11-05";

// Mathematical primitives
function calculateAmortization(principal, annualRate, tenureMonths, graceMonths = 0) {
  const p = Number(principal);
  const r = Number(annualRate) / 12;
  const n = Number(tenureMonths);
  const g = Number(graceMonths);

  if (p <= 0 || n <= 0) {
    throw new Error("Principal and tenure must be positive numbers.");
  }

  let monthlyPayment = 0;
  if (r === 0) {
    monthlyPayment = p / n;
  } else {
    monthlyPayment = (p * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }
  monthlyPayment = Math.round(monthlyPayment * 100) / 100;

  let balance = p;
  let totalInterest = 0;
  const schedule = [];

  for (let m = 1; m <= n + g; m++) {
    const isGrace = m <= g;
    const interest = Math.round(balance * r * 100) / 100;
    let principalPaid = 0;
    let payment = 0;

    if (isGrace) {
      payment = interest;
      principalPaid = 0;
    } else {
      payment = monthlyPayment;
      principalPaid = Math.round((payment - interest) * 100) / 100;
      if (m === n + g || principalPaid > balance) {
        principalPaid = balance;
        payment = principalPaid + interest;
      }
      balance = Math.max(0, Math.round((balance - principalPaid) * 100) / 100);
    }

    totalInterest = Math.round((totalInterest + interest) * 100) / 100;
    schedule.push({
      month: m,
      payment,
      principalPaid,
      interestPaid: interest,
      remainingBalance: balance,
      isGracePeriod: isGrace,
    });
  }

  return {
    principal: p,
    annualRatePct: Number(annualRate) * 100,
    tenureMonths: n,
    graceMonths: g,
    monthlyPayment,
    totalInterest,
    totalPayable: Math.round((p + totalInterest) * 100) / 100,
    schedulePreview: schedule.slice(0, 4),
    fullScheduleCount: schedule.length,
  };
}

function calculateXirr(cashflows, guess = 0.1) {
  if (!Array.isArray(cashflows) || cashflows.length < 2) {
    throw new Error("XIRR requires at least two cashflow events.");
  }

  const parsed = cashflows.map((cf) => ({
    amount: Number(cf.amount),
    date: new Date(cf.date),
  }));

  const d0 = parsed[0].date.getTime();

  function xnpv(rate) {
    return parsed.reduce((acc, cf) => {
      const days = (cf.date.getTime() - d0) / (1000 * 60 * 60 * 24);
      return acc + cf.amount / Math.pow(1 + rate, days / 365.0);
    }, 0);
  }

  function xnpvPrime(rate) {
    return parsed.reduce((acc, cf) => {
      const days = (cf.date.getTime() - d0) / (1000 * 60 * 60 * 24);
      return (
        acc -
        ((days / 365.0) * cf.amount) / Math.pow(1 + rate, days / 365.0 + 1)
      );
    }, 0);
  }

  let r = guess;
  for (let i = 0; i < 100; i++) {
    const f = xnpv(r);
    const df = xnpvPrime(r);
    if (Math.abs(df) < 1e-12) break;
    const nextR = r - f / df;
    if (Math.abs(nextR - r) < 1e-7) {
      return {
        annualizedRate: Math.round(nextR * 10000) / 10000,
        annualizedRatePct: `${(nextR * 100).toFixed(2)}%`,
        iterations: i + 1,
        status: "converged",
      };
    }
    r = nextR;
  }

  return {
    annualizedRate: Math.round(r * 10000) / 10000,
    annualizedRatePct: `${(r * 100).toFixed(2)}%`,
    status: "approximation",
  };
}

function formatBDT(amount, showSymbol = true) {
  const num = Number(amount);
  const isNegative = num < 0;
  const abs = Math.abs(num).toFixed(2);
  const [intPart, decPart] = abs.split(".");

  let formatted = "";
  if (intPart.length <= 3) {
    formatted = intPart;
  } else {
    const lastThree = intPart.substring(intPart.length - 3);
    const remaining = intPart.substring(0, intPart.length - 3);
    const groups = [];
    for (let i = remaining.length; i > 0; i -= 2) {
      const start = Math.max(0, i - 2);
      groups.unshift(remaining.substring(start, i));
    }
    formatted = `${groups.join(",")},${lastThree}`;
  }

  const result = `${isNegative ? "-" : ""}${formatted}.${decPart}`;
  return {
    amount: num,
    formatted: showSymbol ? `BDT ${result}` : result,
    symbol: "BDT",
    subUnitTaka: intPart,
    subUnitPoisha: decPart,
  };
}

function assessCreditRisk(params) {
  const inflows = Number(params.monthly_inflows || 0);
  const outflows = Number(params.monthly_outflows || 0);
  const avgBalance = Number(params.avg_balance || 0);
  const txFreq = Number(params.tx_frequency || 0);
  const utility = Number(params.utility_consistency || 1.0);
  const reqAmount = Number(params.requested_amount || 20000);

  const netCashFlow = Math.max(0, inflows - outflows);
  const savingsBuffer = outflows > 0 ? avgBalance / outflows : 1.0;

  let baseScore = 550;
  baseScore += Math.min(120, (netCashFlow / 20000) * 40);
  baseScore += Math.min(80, savingsBuffer * 40);
  baseScore += Math.min(60, (txFreq / 30) * 30);
  baseScore += utility * 40;

  const score = Math.min(850, Math.max(300, Math.round(baseScore)));
  let riskTier = "Subprime";
  let defaultProbability = 0.12;

  if (score >= 740) {
    riskTier = "Prime";
    defaultProbability = 0.021;
  } else if (score >= 670) {
    riskTier = "Near-Prime";
    defaultProbability = 0.048;
  } else if (score >= 580) {
    riskTier = "Standard";
    defaultProbability = 0.085;
  }

  const recommendedLimit = Math.round(
    Math.min(reqAmount, netCashFlow * 1.5, avgBalance * 3),
  );

  return {
    score,
    maxScore: 850,
    riskTier,
    defaultProbability,
    defaultProbabilityPct: `${(defaultProbability * 100).toFixed(2)}%`,
    recommendedCreditLimit: recommendedLimit,
    recommendedLimitBDT: `BDT ${recommendedLimit.toLocaleString("en-US")}`,
    requestedAmount: reqAmount,
  };
}

// Tool definitions for MCP
const TOOLS = [
  {
    name: "calculate_amortization",
    description:
      "Calculates deterministic reducing-balance loan amortization schedules, exact monthly EMI, total interest, and optional grace periods with zero floating-point drift.",
    inputSchema: {
      type: "object",
      properties: {
        principal: {
          type: "number",
          description: "Loan principal amount (e.g. 100000).",
        },
        annual_rate: {
          type: "number",
          description: "Annual interest rate as decimal (e.g. 0.09 for 9%).",
        },
        tenure_months: {
          type: "integer",
          description: "Total repayment tenure in months (e.g. 12, 24, 36).",
        },
        grace_months: {
          type: "integer",
          description:
            "Optional grace period months where only interest is paid (default: 0).",
        },
      },
      required: ["principal", "annual_rate", "tenure_months"],
    },
  },
  {
    name: "calculate_xirr",
    description:
      "Calculates exact non-periodic annualized Internal Rate of Return (XIRR) from a series of cash flows with dates.",
    inputSchema: {
      type: "object",
      properties: {
        cashflows: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: {
                type: "string",
                description: "ISO date string (YYYY-MM-DD).",
              },
              amount: {
                type: "number",
                description:
                  "Cashflow amount (negative for disbursement/investment, positive for returns).",
              },
            },
            required: ["date", "amount"],
          },
          description: "Array of chronological cash flow objects.",
        },
      },
      required: ["cashflows"],
    },
  },
  {
    name: "format_bdt_currency",
    description:
      "Formats financial amounts into standard Bangladeshi Taka (BDT) sub-unit grouping (Lakh/Crore comma placement) with deterministic rounding.",
    inputSchema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "Currency amount to format.",
        },
        show_symbol: {
          type: "boolean",
          description: "Whether to prepend BDT symbol (default: true).",
        },
      },
      required: ["amount"],
    },
  },
  {
    name: "assess_credit_risk",
    description:
      "Evaluates thin-file alternative credit risk score (300-850) and recommended credit limits using Mobile Financial Service (MFS) cashflow metrics.",
    inputSchema: {
      type: "object",
      properties: {
        monthly_inflows: {
          type: "number",
          description: "Total monthly wallet inflows (e.g. 75000).",
        },
        monthly_outflows: {
          type: "number",
          description: "Total monthly wallet outflows (e.g. 35000).",
        },
        avg_balance: {
          type: "number",
          description: "Daily average account balance (e.g. 18000).",
        },
        tx_frequency: {
          type: "integer",
          description: "Monthly transaction count (e.g. 40).",
        },
        utility_consistency: {
          type: "number",
          description:
            "Utility bill on-time payment ratio between 0.0 and 1.0 (e.g. 1.0).",
        },
        requested_amount: {
          type: "number",
          description: "Requested micro-loan amount (e.g. 50000).",
        },
      },
      required: ["monthly_inflows", "monthly_outflows", "avg_balance"],
    },
  },
];

// JSON-RPC Request Handler
function handleRequest(request) {
  const { id, method, params } = request;

  switch (method) {
    case "initialize":
      return {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: SERVER_NAME,
            version: SERVER_VERSION,
          },
        },
      };

    case "notifications/initialized":
      return null;

    case "tools/list":
      return {
        jsonrpc: "2.0",
        id,
        result: {
          tools: TOOLS,
        },
      };

    case "tools/call": {
      const { name, arguments: args } = params || {};
      try {
        let resultData = null;
        if (name === "calculate_amortization") {
          resultData = calculateAmortization(
            args.principal,
            args.annual_rate,
            args.tenure_months,
            args.grace_months || 0,
          );
        } else if (name === "calculate_xirr") {
          resultData = calculateXirr(args.cashflows);
        } else if (name === "format_bdt_currency") {
          resultData = formatBDT(
            args.amount,
            args.show_symbol !== false,
          );
        } else if (name === "assess_credit_risk") {
          resultData = assessCreditRisk(args || {});
        } else {
          return {
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: `Unknown tool: ${name}`,
            },
          };
        }

        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(resultData, null, 2),
              },
            ],
          },
        };
      } catch (err) {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: `Error executing ${name}: ${err.message}`,
              },
            ],
            isError: true,
          },
        };
      }
    }

    default:
      return {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
  }
}

// Stdio Stream Listener
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const request = JSON.parse(trimmed);
    const response = handleRequest(request);
    if (response) {
      process.stdout.write(JSON.stringify(response) + "\n");
    }
  } catch (err) {
    const errorResponse = {
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32700,
        message: `Parse error: ${err.message}`,
      },
    };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
