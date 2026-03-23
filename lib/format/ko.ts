/** 원화 표시(정수) */
export function formatWon(n: number): string {
  return `${new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n)}원`;
}

export function formatNumber(n: number, maxFractionDigits = 4): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: maxFractionDigits }).format(n);
}

/** 입력 문자열에서 숫자만 추출(쉼표 허용) */
export function parseAmount(raw: string): number | null {
  const s = raw.replace(/,/g, "").trim();
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return n;
}
