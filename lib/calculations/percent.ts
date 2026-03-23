/** A의 B% */
export function percentOf(a: number, bPercent: number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(bPercent)) return null;
  return (a * bPercent) / 100;
}

/** A에서 B% 증가 */
export function increaseByPercent(a: number, bPercent: number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(bPercent)) return null;
  return a * (1 + bPercent / 100);
}

/** A에서 B% 감소 */
export function decreaseByPercent(a: number, bPercent: number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(bPercent)) return null;
  return a * (1 - bPercent / 100);
}

/** (이전→이후) 변화율 % */
export function percentChange(from: number, to: number): number | null {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === 0) return null;
  return ((to - from) / from) * 100;
}
