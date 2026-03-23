/** 만 나이·연도 나이(참고). 로컬 날짜 기준. */

function parseYmd(ymd: string): { y: number; m: number; d: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0, 0);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return { y, m, d };
}

export type KoreanAgeResult = {
  manAge: number;
  yearAge: number;
  /** 세는 나이(연도만 보는 간단 모델, 참고용) */
  traditionalCountingAge: number;
};

export function calculateKoreanAge(
  birthYmd: string,
  refYmd: string,
): KoreanAgeResult | null {
  const b = parseYmd(birthYmd);
  const r = parseYmd(refYmd);
  if (!b || !r) return null;
  if (r.y < b.y || (r.y === b.y && (r.m < b.m || (r.m === b.m && r.d < b.d)))) {
    return null;
  }

  let manAge = r.y - b.y;
  if (r.m < b.m || (r.m === b.m && r.d < b.d)) manAge -= 1;

  const yearAge = r.y - b.y;
  const traditionalCountingAge = yearAge + 1;

  return { manAge, yearAge, traditionalCountingAge };
}
