/** 세전 액면 기준: 연봉 ÷ 12, 월급 × 12 (원 단위 반올림) */
export function annualToMonthly(annual: number): number {
  if (!Number.isFinite(annual) || annual < 0) return NaN;
  return Math.round(annual / 12);
}

export function monthlyToAnnual(monthly: number): number {
  if (!Number.isFinite(monthly) || monthly < 0) return NaN;
  return Math.round(monthly * 12);
}
