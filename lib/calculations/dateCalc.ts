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

/** 시작일→종료일 일 수 (종료 − 시작). 음수면 역순. */
export function diffCalendarDays(startYmd: string, endYmd: string): number | null {
  const a = parseYmd(startYmd);
  const b = parseYmd(endYmd);
  if (!a || !b) return null;
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / 86400000);
}

export function addCalendarDays(baseYmd: string, deltaDays: number): string | null {
  const d = parseYmd(baseYmd);
  if (!d || !Number.isFinite(deltaDays)) return null;
  d.setDate(d.getDate() + Math.trunc(deltaDays));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
