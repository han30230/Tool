/** 페이스: 총 시간(초) ÷ 거리(km). */

export function paceMinPerKm(totalSeconds: number, distanceKm: number): number | null {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return null;
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return null;
  return totalSeconds / 60 / distanceKm;
}

export function formatMinPerKm(minPerKm: number): string {
  if (!Number.isFinite(minPerKm) || minPerKm < 0) return "—";
  const totalSec = Math.round(minPerKm * 60);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")} /km`;
}
