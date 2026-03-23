/** 복리 미래가치. 연이율 %, 기간(년), 연 복리 횟수. 참고용. */

export type CompoundResult = {
  futureValue: number;
  interest: number;
};

export function calculateCompoundInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundsPerYear: number,
): CompoundResult | null {
  if (!Number.isFinite(principal) || principal < 0) return null;
  if (!Number.isFinite(years) || years < 0 || years > 100) return null;
  const n = Math.max(1, Math.min(365, Math.floor(compoundsPerYear)));
  const r = annualRatePercent / 100;
  if (!Number.isFinite(r)) return null;
  const nt = n * years;
  const amount = principal * (1 + r / n) ** nt;
  if (!Number.isFinite(amount)) return null;
  const fv = Math.round(amount);
  return {
    futureValue: fv,
    interest: Math.round(fv - principal),
  };
}
