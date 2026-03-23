/** 시급·주간 근로시간 → 월 환산(주 52주 ÷ 12개월). 참고용. */

const WEEKS_PER_MONTH = 52 / 12;

export type HourlyMonthlyResult = {
  monthlyFromHourly: number;
  hourlyFromMonthly: number;
};

export function hourlyToMonthly(hourlyWon: number, hoursPerWeek: number): number | null {
  if (!Number.isFinite(hourlyWon) || hourlyWon <= 0) return null;
  if (!Number.isFinite(hoursPerWeek) || hoursPerWeek <= 0 || hoursPerWeek > 168) return null;
  return Math.round(hourlyWon * hoursPerWeek * WEEKS_PER_MONTH);
}

export function monthlyToHourly(monthlyWon: number, hoursPerWeek: number): number | null {
  if (!Number.isFinite(monthlyWon) || monthlyWon <= 0) return null;
  if (!Number.isFinite(hoursPerWeek) || hoursPerWeek <= 0 || hoursPerWeek > 168) return null;
  const h = monthlyWon / (hoursPerWeek * WEEKS_PER_MONTH);
  if (!Number.isFinite(h)) return null;
  return Math.round(h);
}
