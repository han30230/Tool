/** 90분 주기·잠들기 여유(분) 단순 모델. 참고용. */

const CYCLE_MIN = 90;
const FALL_ASLEEP_MIN = 14;

function modDay(mins: number): number {
  const d = 24 * 60;
  return ((mins % d) + d) % d;
}

export function formatHm(totalMinutes: number): string {
  const t = modDay(totalMinutes);
  const h = Math.floor(t / 60);
  const m = t % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** HH:mm 문자열 → 분(0~1439) */
export function parseTimeToMinutes(hhmm: string): number | null {
  if (!/^\d{1,2}:\d{2}$/.test(hhmm)) return null;
  const [hs, ms] = hhmm.split(":");
  const h = Number(hs);
  const m = Number(ms);
  if (!Number.isInteger(h) || !Number.isInteger(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

export type BedSuggestion = {
  cycles: number;
  bedTime: string;
  sleepHoursApprox: number;
};

export function suggestBedtimesBeforeWake(
  wakeMinutes: number,
  cycleCounts: number[] = [4, 5, 6],
): BedSuggestion[] {
  return cycleCounts.map((c) => {
    const bedMin = modDay(wakeMinutes - FALL_ASLEEP_MIN - c * CYCLE_MIN);
    return {
      cycles: c,
      bedTime: formatHm(bedMin),
      sleepHoursApprox: Math.round((c * CYCLE_MIN + FALL_ASLEEP_MIN) / 60 * 10) / 10,
    };
  });
}
