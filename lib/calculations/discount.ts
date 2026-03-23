export type DiscountFromPrices = {
  discountPercent: number;
  savings: number;
  finalPrice: number;
};

/** 정가·할인가로 할인율·절약액 */
export function fromOriginalAndSale(original: number, sale: number): DiscountFromPrices | null {
  if (!Number.isFinite(original) || !Number.isFinite(sale) || original <= 0) return null;
  const savings = Math.max(0, original - sale);
  const discountPercent = (savings / original) * 100;
  return { discountPercent, savings, finalPrice: sale };
}

/** 정가·할인율(%)로 최종가·절약액 */
export function fromOriginalAndRate(original: number, discountPercent: number): DiscountFromPrices | null {
  if (!Number.isFinite(original) || !Number.isFinite(discountPercent)) return null;
  if (original < 0 || discountPercent < 0 || discountPercent > 100) return null;
  const finalPrice = original * (1 - discountPercent / 100);
  const savings = original - finalPrice;
  return { discountPercent, savings, finalPrice };
}
