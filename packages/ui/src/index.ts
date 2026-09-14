import { formatMoney } from '@finengine/core';
import type { AmortizeResult, ScheduleRow } from '@finengine/math';

export type KpiTone = 'neutral' | 'positive' | 'warning';
export type LearningLevel = 'intro' | 'applied' | 'advanced';
export type BurdenTone = 'healthy' | 'watch' | 'high' | 'unknown';

export interface KpiCardModel {
  label: string;
  value: string;
  tone: KpiTone;
  helper?: string;
}

export interface SchedulePreviewRow {
  month: number;
  principal: string;
  interest: string;
  balance: string;
}

export interface RepaymentSummaryModel {
  scenario: string;
  monthlyPayment: string;
  totalInterest: string;
  totalPayable: string;
  processingFee: string;
  burdenLabel: string;
  burdenTone: BurdenTone;
  burdenPct: number | null;
  schedulePreview: SchedulePreviewRow[];
}

export interface LearningCardModel {
  title: string;
  badge: string;
  audience: string;
  outcome: string;
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
  const pct = round1((payment / income) * 100);
  if (pct > 45) return `High burden · ${pct}% of income`;
  if (pct > 30) return `Watch burden · ${pct}% of income`;
  return `Healthy burden · ${pct}% of income`;
}

export function makeLearningBadge(topic: string, level: LearningLevel): string {
  return `${topic} · ${level}`;
}

export function makeSchedulePreview(schedule: ScheduleRow[], limit = 4): SchedulePreviewRow[] {
  return schedule.slice(0, Math.max(1, limit)).map((row) => ({
    month: row.month,
    principal: formatMoney(row.principalPaid),
    interest: formatMoney(row.interestPaid),
    balance: formatMoney(row.remainingBalance),
  }));
}

export function makeRepaymentSummary(
  scenario: string,
  plan: AmortizeResult,
  monthlyIncome = 0,
  processingFeePct = 0,
): RepaymentSummaryModel {
  const principal = round2(plan.schedule.reduce((sum, row) => sum + row.principalPaid, 0));
  const processingFee = round2(principal * (processingFeePct / 100));
  const burdenPct = monthlyIncome > 0 ? round1((plan.monthlyPayment / monthlyIncome) * 100) : null;
  return {
    scenario,
    monthlyPayment: formatMoney(plan.monthlyPayment),
    totalInterest: formatMoney(plan.totalInterest),
    totalPayable: formatMoney(plan.totalPayable + processingFee),
    processingFee: formatMoney(processingFee),
    burdenLabel: burdenPct === null ? 'Income not provided' : formatBurdenLabel(plan.monthlyPayment, monthlyIncome),
    burdenTone: getBurdenTone(burdenPct),
    burdenPct,
    schedulePreview: makeSchedulePreview(plan.schedule),
  };
}

export function makeLearningCards(): LearningCardModel[] {
  return [
    {
      title: 'BDT money basics',
      badge: makeLearningBadge('Bangladesh', 'intro'),
      audience: 'Students and first-time builders',
      outcome: 'Understand currency formatting, rounding, and cash in/out language before building apps.',
    },
    {
      title: 'EMI and repayment reading',
      badge: makeLearningBadge('EMI', 'applied'),
      audience: 'Households, trainers, and SME founders',
      outcome: 'Read installment burden, total interest, and repayment trade-offs with practical BDT examples.',
    },
    {
      title: 'MFS and merchant ledger flow',
      badge: makeLearningBadge('Ledger', 'advanced'),
      audience: 'Commerce learners and fintech product teams',
      outcome: 'Map settlement, fees, and balance checks into UI blocks that users can actually understand.',
    },
  ];
}

function getBurdenTone(pct: number | null): BurdenTone {
  if (pct === null) return 'unknown';
  if (pct > 45) return 'high';
  if (pct > 30) return 'watch';
  return 'healthy';
}

function round1(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
