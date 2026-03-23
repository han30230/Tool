/** 단어 첫 글자만 대문자(라틴 기준 단순) */
export function toTitleCase(s: string): string {
  return s.replace(/\S+/g, (w) => {
    if (w.length === 0) return w;
    return w.charAt(0).toLocaleUpperCase("ko-KR") + w.slice(1).toLocaleLowerCase("ko-KR");
  });
}

/** 줄마다 앞글자만 대문자, 나머지 소문자(간단 문장형) */
export function toSentenceCaseLines(s: string): string {
  return s
    .split(/\r?\n/)
    .map((line) => {
      const t = line.trim();
      if (!t) return line;
      return t.charAt(0).toLocaleUpperCase("ko-KR") + t.slice(1).toLocaleLowerCase("ko-KR");
    })
    .join("\n");
}
