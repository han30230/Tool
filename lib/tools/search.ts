import type { ResolvedTool } from "@/content/tools/types";
import { categories } from "@/content/tools/registry";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/** 토큰 단위 AND 검색. 제목·설명·키워드·태그·별칭·카테고리명 포함. */
export function filterToolsByQuery(tools: ResolvedTool[], query: string): ResolvedTool[] {
  const raw = query.trim();
  if (!raw) return [];
  const tokens = raw
    .split(/\s+/)
    .map(normalize)
    .filter(Boolean);
  if (tokens.length === 0) return [];

  return tools.filter((t) => {
    const catTitle = categories[t.categoryId]?.title ?? "";
    const hay = [
      t.slug,
      t.title,
      t.shortTitle,
      t.description,
      t.metaDescription,
      t.introText,
      ...t.keywords,
      ...t.tags,
      ...t.searchAliases,
      catTitle,
      t.subcategory ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return tokens.every((tok) => hay.includes(tok));
  });
}
