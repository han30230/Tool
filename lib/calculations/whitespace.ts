export type WhitespaceMode = "removeBreaks" | "breaksToSpace" | "collapseSpace";

/**
 * removeBreaks: 개행만 제거
 * breaksToSpace: 개행→공백 후 연속 공백 1칸
 * collapseSpace: 모든 공백류 연속을 1칸(개행도 공백으로 취급)
 */
export function normalizeWhitespace(
  text: string,
  mode: WhitespaceMode,
  trimEdges: boolean,
): string {
  let t = trimEdges ? text.trim() : text;
  if (mode === "removeBreaks") {
    t = t.replace(/\r\n|\n|\r/g, "");
  } else if (mode === "breaksToSpace") {
    t = t.replace(/\r\n|\n|\r/g, " ");
    t = t.replace(/[ \t]+/g, " ");
  } else {
    t = t.replace(/\s+/g, " ");
  }
  if (trimEdges) t = t.trim();
  return t;
}
