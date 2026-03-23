export type MarginFromCostPrice = {
  marginAmount: number;
  /** 판매가 대비 마진율 % */
  marginPercentOnPrice: number;
  /** 원가 대비 마크업 % */
  markupPercentOnCost: number;
};

/** 원가·판매가로 마진액·마진율·마크업 */
export function fromCostAndPrice(cost: number, price: number): MarginFromCostPrice | null {
  if (!Number.isFinite(cost) || !Number.isFinite(price) || price <= 0) return null;
  if (cost < 0) return null;
  const marginAmount = price - cost;
  const marginPercentOnPrice = (marginAmount / price) * 100;
  const markupPercentOnCost = cost === 0 ? 0 : (marginAmount / cost) * 100;
  return { marginAmount, marginPercentOnPrice, markupPercentOnCost };
}

/** 목표 마진율(판매가 대비 %) + 원가 → 필요 판매가 */
export function priceForTargetMarginPercent(cost: number, marginPercentOnPrice: number): number | null {
  if (!Number.isFinite(cost) || !Number.isFinite(marginPercentOnPrice)) return null;
  if (cost < 0 || marginPercentOnPrice < 0 || marginPercentOnPrice >= 100) return null;
  return cost / (1 - marginPercentOnPrice / 100);
}
