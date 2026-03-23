import type { ResolvedTool } from "@/content/tools/types";

/** 제목·짧은 제목·설명·키워드·슬러그 기준 부분 일치 검색 */
export function filterToolsByQuery(tools: ResolvedTool[], query: string): ResolvedTool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return tools.filter((t) => {
    const hay = [
      t.slug,
      t.title,
      t.shortTitle,
      t.description,
      t.metaDescription,
      ...t.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}
