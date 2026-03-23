/** 대한민국 일반 과세 부가세율 */
export const VAT_RATE = 0.1;

export type VatBreakdown = {
  supply: number;
  vat: number;
  total: number;
};

function roundWon(n: number): number {
  return Math.round(n);
}

/** 공급가액(과세표준) 기준 */
export function fromSupplyPrice(supply: number): VatBreakdown | null {
  if (!Number.isFinite(supply) || supply < 0) return null;
  const vat = roundWon(supply * VAT_RATE);
  const total = supply + vat;
  return { supply: roundWon(supply), vat, total };
}

/** 합계(부가세 포함가) 기준 — 역산 시 원 단위 반올림 차이 발생 가능 */
export function fromTotalInclVat(total: number): VatBreakdown | null {
  if (!Number.isFinite(total) || total < 0) return null;
  const supply = roundWon(total / (1 + VAT_RATE));
  const vat = total - supply;
  return { supply, vat, total: roundWon(total) };
}
