export type TextStats = {
  charsWithSpaces: number;
  charsNoSpaces: number;
  words: number;
  lines: number;
  bytesUtf8: number;
};

export function analyzeText(text: string): TextStats {
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const trimmed = text.trim();
  const words =
    trimmed.length === 0
      ? 0
      : trimmed.split(/\s+/).filter(Boolean).length;
  const lines = text.length === 0 ? 0 : text.split(/\r\n|\n|\r/).length;
  const bytesUtf8 = new TextEncoder().encode(text).length;
  return { charsWithSpaces, charsNoSpaces, words, lines, bytesUtf8 };
}
