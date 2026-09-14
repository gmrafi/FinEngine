# @finengine/ui

UI-friendly formatting helpers and small view-model builders for FinEngine.

## What it does
- Builds KPI card models from money amounts
- Labels repayment burden in learner-friendly language
- Generates small learning badges for docs and teaching surfaces

## Bangladesh-oriented examples
- BDT-first KPI labels for dashboards and finance teaching cards
- EMI burden labels for students, households, and SME founders
- Small UI helpers for bilingual finance education surfaces

## Example
```ts
import { makeMoneyKpi, formatBurdenLabel, makeLearningBadge } from '@finengine/ui';

makeMoneyKpi('Monthly EMI', 16967.64, '36-month SME example');
// { label: 'Monthly EMI', value: 'BDT 16,968', tone: 'positive', helper: '36-month SME example' }

formatBurdenLabel(16967.64, 85000);
// Healthy burden · 20% of income

makeLearningBadge('EMI', 'intro');
// EMI · intro
```
