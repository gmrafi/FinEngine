# FinEngine Google Sheets & Excel Custom Formulas

Add deterministic loan calculations, repayment math, and standard Bangladeshi Taka (BDT) Lakh/Crore grouping directly into your Google Sheets and Excel workbooks.

## How to Install in Google Sheets (1 Minute)

1. Open any spreadsheet in [Google Sheets](https://sheets.google.com).
2. Go to the menu: **Extensions** -> **Apps Script**.
3. Replace the existing content with the code from [`FinEngine.gs`](FinEngine.gs).
4. Click the **Save** (disk) icon.
5. Return to your spreadsheet and use the custom formulas!

---

## Available Spreadsheet Formulas

### 1. `=FINENGINE_EMI(principal, annualRate, tenureMonths)`
Calculates exact monthly loan installment (reducing balance).
```excel
=FINENGINE_EMI(500000, 9%, 36)
// Output: 15899.86
```

### 2. `=FINENGINE_TOTAL_INTEREST(principal, annualRate, tenureMonths)`
Calculates total cumulative interest over the full loan tenure.
```excel
=FINENGINE_TOTAL_INTEREST(500000, 9%, 36)
// Output: 72394.96
```

### 3. `=FINENGINE_BDT(amount, [showSymbol])`
Formats numbers with standard Bangladeshi Taka Lakh/Crore comma placement.
```excel
=FINENGINE_BDT(12500000)
// Output: "BDT 1,25,00,000.00"
```

### 4. `=FINENGINE_XIRR(datesRange, amountsRange)`
Calculates exact annualized Internal Rate of Return for irregular cash flow dates.
```excel
=FINENGINE_XIRR(A2:A10, B2:B10)
// Output: 0.2845 (28.45%)
```
