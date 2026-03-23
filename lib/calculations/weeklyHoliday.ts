export type WeeklyHolidayInput = {
  hourlyWage: number;
  /** 1주 소정근로시간 */
  weeklyHours: number;
};

export type WeeklyHolidayResult = {
  /** 주 15시간 이상 여부(주휴 적용 대략 기준) */
  eligible: boolean;
  /** 주휴 시간(시간 단위, 소수 2자리) */
  weeklyHolidayHours: number;
  /** 주휴수당(원) */
  weeklyHolidayPay: number;
  /** 시급 × 주간 근로시간(참고용 주급 중 근로분) */
  weeklyWorkPay: number;
};

/**
 * 주 15시간 미만: 주휴 미적용으로 가정.
 * 주휴시간 = min(8, (주간근로시간 / 40) × 8) — 40시간 주를 기준으로 한 단순 비례.
 */
export function calculateWeeklyHoliday(
  input: WeeklyHolidayInput,
): WeeklyHolidayResult | null {
  const { hourlyWage, weeklyHours } = input;
  if (!Number.isFinite(hourlyWage) || hourlyWage <= 0) return null;
  if (!Number.isFinite(weeklyHours) || weeklyHours <= 0) return null;

  const eligible = weeklyHours >= 15;

  const weeklyHolidayHours = eligible
    ? Math.min(8, (weeklyHours / 40) * 8)
    : 0;

  const weeklyHolidayPay = Math.round(weeklyHolidayHours * hourlyWage);
  const weeklyWorkPay = Math.round(weeklyHours * hourlyWage);

  return {
    eligible,
    weeklyHolidayHours: Math.round(weeklyHolidayHours * 100) / 100,
    weeklyHolidayPay,
    weeklyWorkPay,
  };
}
