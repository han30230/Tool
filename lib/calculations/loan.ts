/** 원리금균등 상환 월 납입액·총 이자. 연이율 %, 월수. 참고용. */

export type LoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
};

export function calculateEqualPaymentLoan(
  principal: number,
  annualRatePercent: number,
  months: number,
): LoanResult | null {
  if (!Number.isFinite(principal) || principal <= 0) return null;
  if (!Number.isFinite(months) || months < 1 || months > 600) return null;
  const r = annualRatePercent / 100 / 12;
  if (!Number.isFinite(r) || r < 0) return null;

  let monthly: number;
  if (r === 0) {
    monthly = principal / months;
  } else {
    const pow = (1 + r) ** months;
    monthly = (principal * r * pow) / (pow - 1);
  }

  if (!Number.isFinite(monthly) || monthly <= 0) return null;
  const totalPayment = monthly * months;
  const totalInterest = totalPayment - principal;
  return {
    monthlyPayment: Math.round(monthly),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
}
