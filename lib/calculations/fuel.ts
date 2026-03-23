/** km/L ↔ L/100km. */

export function kmPerLToLPer100km(kmPerL: number): number | null {
  if (!Number.isFinite(kmPerL) || kmPerL <= 0) return null;
  return 100 / kmPerL;
}

export function lPer100kmToKmPerL(lPer100: number): number | null {
  if (!Number.isFinite(lPer100) || lPer100 <= 0) return null;
  return 100 / lPer100;
}
