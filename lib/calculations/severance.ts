import { diffCalendarDays } from "./dateCalc";

export type SeveranceInput = {
  hireYmd: string;
  endYmd: string;
  /** 최근 3개월 임금 총액(통상임금 산정용) */
  wagesLast3MonthsTotal: number;
  /** 최근 1년 상여 총액(선택, 평균임금 가산에 반영) */
  bonusLast12Months?: number;
  /** 미사용 연차수당 등(선택) */
  unusedLeavePay?: number;
};

export type SeveranceResult = {
  workDays: number;
  /** 계속근로 1년 이상 여부(일수 기준) */
  eligibleOneYearPlus: boolean;
  /** 1일 평균임금(원, 반올림) */
  averageDailyWage: number;
  /** 예상 퇴직금(원, 반올림). 1년 미만이면 0 */
  severancePay: number;
};

/** 최근 3개월 일수(달력) — 대략 90~92일, 여기서는 91일로 단순화 */
const DAYS_FOR_3_MONTHS = 91;

/**
 * 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365) — 참고용 단순 모델.
 * 평균임금 = (3개월 임금총액 + 상여·연차수당 가산) / 3개월간 총일수 로 근사.
 */
export function calculateSeverance(input: SeveranceInput): SeveranceResult | null {
  const days = diffCalendarDays(input.hireYmd, input.endYmd);
  if (days === null) return null;
  if (days < 0) return null;

  const workDays = days;
  const eligibleOneYearPlus = workDays >= 365;

  const w3 = input.wagesLast3MonthsTotal;
  if (!Number.isFinite(w3) || w3 <= 0) return null;

  const bonus = Math.max(0, input.bonusLast12Months ?? 0);
  const unused = Math.max(0, input.unusedLeavePay ?? 0);

  /** 상여·연차수당을 3개월분에 분배해 가산(참고용) */
  const numerator = w3 + bonus / 4 + unused;
  const averageDailyWage = Math.round(numerator / DAYS_FOR_3_MONTHS);

  if (!eligibleOneYearPlus) {
    return {
      workDays,
      eligibleOneYearPlus: false,
      averageDailyWage,
      severancePay: 0,
    };
  }

  const severancePay = Math.round(
    averageDailyWage * 30 * (workDays / 365),
  );

  return {
    workDays,
    eligibleOneYearPlus: true,
    averageDailyWage,
    severancePay,
  };
}
