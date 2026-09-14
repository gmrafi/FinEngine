import { formatMoney } from '@finengine/core';

export interface KpiCardModel {
  label: string;
  value: string;
  tone: 'neutral' | 'positive' | 'warning';
  helper?: string;
}

export function makeMoneyKpi(label: string, amount: number, helper?: string): KpiCardModel {
  return {
    label,
    value: formatMoney(amount),
    tone: amount >= 0 ? 'positive' : 'warning',
    helper,
  };
}

export function formatBurdenLabel(payment: number, income: number): string {
  if (income <= 0) return 'Income not provided';
  const pct = Math.round((payment / income) * 1000) / 10;
  if (pct > 45) return `High burden · ${pct}% of income`;
  if (pct > 30) return `Watch burden · ${pct}% of income`;
  return `Healthy burden · ${pct}% of income`;
}

export function makeLearningBadge(topic: string, level: 'intro' | 'applied' | 'advanced'): string {
  return `${topic} · ${level}`;
}
