# FinEngine Model Context Protocol (MCP) Server

Zero-dependency JSON-RPC 2.0 stdio server providing deterministic financial mathematics, BDT currency localization, and alternative credit risk tools for AI agents.

## Supported Clients
- Anthropic Claude Desktop
- Cursor IDE
- Google Antigravity
- Custom Autonomous Financial Agents

---

## Quickstart Configuration

### 1. Claude Desktop
Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "finengine": {
      "command": "npx",
      "args": ["-y", "@finengine/mcp-server"]
    }
  }
}
```

### 2. Cursor IDE
Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "finengine": {
      "command": "npx",
      "args": ["-y", "@finengine/mcp-server"]
    }
  }
}
```

> **Local Source Development:** If running directly from this cloned repository, use `"command": "node"` and `"args": ["./examples/mcp-server/index.mjs"]`.

---

## Exposed Tools

| Tool | Purpose | Key Arguments |
| :--- | :--- | :--- |
| `calculate_amortization` | Deterministic loan schedule, monthly EMI, total interest | `principal`, `annual_rate`, `tenure_months`, `grace_months` |
| `calculate_xirr` | Exact non-periodic annualized return from dated cash flows | `cashflows` `[{ date, amount }]` |
| `format_bdt_currency` | Bangladeshi Taka formatting with Lakh/Crore grouping | `amount`, `show_symbol` |
| `assess_credit_risk` | MFS cash flow alternative credit scoring (300-850) | `monthly_inflows`, `monthly_outflows`, `avg_balance` |
