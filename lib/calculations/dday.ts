import { diffCalendarDays } from "./dateCalc";

export type DdayResult = {
  days: number;
  label: string;
};

/** 기준일 기준 목표일까지 일 수. 양수면 남은 일수, 음수면 지난 일수. */
export function calculateDday(baseYmd: string, targetYmd: string): DdayResult | null {
  const days = diffCalendarDays(baseYmd, targetYmd);
  if (days === null) return null;
  let label: string;
  if (days === 0) label = "D-Day";
  else if (days > 0) label = `D-${days}`;
  else label = `D+${Math.abs(days)}`;
  return { days, label };
}
