/** 1평 = 3.305785㎡ (일반적으로 쓰는 환산) */
export const PYEONG_TO_SQM = 3.305785;

export function pyeongToSqm(pyeong: number): number {
  if (!Number.isFinite(pyeong) || pyeong < 0) return NaN;
  return pyeong * PYEONG_TO_SQM;
}

export function sqmToPyeong(sqm: number): number {
  if (!Number.isFinite(sqm) || sqm < 0) return NaN;
  return sqm / PYEONG_TO_SQM;
}
