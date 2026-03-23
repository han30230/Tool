/** 줄 단위로 첫 등장만 유지(순서 유지). 비교 키는 trim·대소문자 무시(옵션) 기준. */
export function dedupeLines(
  text: string,
  opts: { trimForCompare?: boolean; ignoreEmpty?: boolean; caseInsensitive?: boolean } = {},
): string {
  const { trimForCompare = true, ignoreEmpty = true, caseInsensitive = false } = opts;
  const lines = text.split(/\r?\n/);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of lines) {
    const base = trimForCompare ? raw.trim() : raw;
    if (ignoreEmpty && base === "") continue;
    const dedupeKey = caseInsensitive ? base.toLowerCase() : base;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push(trimForCompare ? base : raw);
  }
  return out.join("\n");
}
