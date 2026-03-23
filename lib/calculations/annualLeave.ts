function parseYmd(ymd: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0, 0);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== m - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

function monthsBetweenInclusive(hire: Date, asOf: Date): number {
  let months =
    (asOf.getFullYear() - hire.getFullYear()) * 12 +
    (asOf.getMonth() - hire.getMonth());
  if (asOf.getDate() < hire.getDate()) months -= 1;
  return Math.max(0, months);
}

export type AnnualLeaveInput = {
  hireYmd: string;
  asOfYmd: string;
  /** 이미 사용한 연차(일) */
  usedDays: number;
};

export type AnnualLeaveResult = {
  /** 발생 연차(일, 참고용 단순 모델) */
  accruedDays: number;
  usedDays: number;
  remainingDays: number;
  /** 1년 미만 구간에서 월 단위 발생으로 가정한 설명용 */
  noteKey: "under1y" | "over1y";
};

/**
 * 입사일 기준 참고용 연차.
 * - 1년 미만: 매 1개월 개근 시 1일 발생으로 가정, 최대 11일(법상 세부와 다를 수 있음).
 * - 1년 이상: 15일 + 2년마다 1일 가산, 최대 25일(단순화).
 */
export function calculateAnnualLeave(input: AnnualLeaveInput): AnnualLeaveResult | null {
  const hire = parseYmd(input.hireYmd);
  const asOf = parseYmd(input.asOfYmd);
  if (!hire || !asOf) return null;
  if (asOf.getTime() < hire.getTime()) return null;

  const used = Math.max(0, Math.floor(input.usedDays));

  const months = monthsBetweenInclusive(hire, asOf);
  if (months === 0) {
    return { accruedDays: 0, usedDays: used, remainingDays: Math.max(0, -used), noteKey: "under1y" };
  }

  let accruedDays: number;
  if (months < 12) {
    accruedDays = Math.min(11, months);
    const result = {
      accruedDays,
      usedDays: used,
      remainingDays: Math.max(0, accruedDays - used),
      noteKey: "under1y" as const,
    };
    return result;
  }

  const fullYears = Math.floor(months / 12);
  const extra = Math.max(0, Math.floor((fullYears - 1) / 2));
  accruedDays = Math.min(25, 15 + extra);

  return {
    accruedDays,
    usedDays: used,
    remainingDays: Math.max(0, accruedDays - used),
    noteKey: "over1y",
  };
}
