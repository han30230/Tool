const SENTENCE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export function buildLorem(paragraphs: number, sentencesPerParagraph: number): string {
  const p = Math.min(20, Math.max(1, paragraphs));
  const s = Math.min(12, Math.max(1, sentencesPerParagraph));
  const block = Array.from({ length: s }, () => SENTENCE).join(" ");
  return Array.from({ length: p }, () => block).join("\n\n");
}
