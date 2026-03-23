import type { ResolvedTool } from "@/content/tools/types";

function tagOverlap(a: ResolvedTool, b: ResolvedTool): number {
  const setA = new Set(a.tags);
  let n = 0;
  for (const x of b.tags) {
    if (setA.has(x)) n += 1;
  }
  return n;
}

/**
 * 규칙 기반 추천: 수동 relatedSlugs + 태그 겹침 + 같은 카테고리 + 인기 가중치.
 * 같은 도구는 제외하고, 중복 슬러그 없이 정렬합니다.
 */
export function getRecommendedTools(
  tool: ResolvedTool,
  all: ResolvedTool[],
  limit = 6,
): ResolvedTool[] {
  const relatedSet = new Set(tool.relatedSlugs);
  const scored = all
    .filter((t) => t.slug !== tool.slug)
    .map((t) => {
      let score =
        tagOverlap(tool, t) * 4 +
        (t.categoryId === tool.categoryId ? 3 : 0) +
        (relatedSet.has(t.slug) ? 8 : 0) +
        (t.featured ? 1 : 0) +
        (t.isNew ? 1 : 0) +
        t.popularityWeight * 0.02;
      if (subcategoryMatch(tool, t)) score += 2;
      return { t, score };
    })
    .sort((a, b) => b.score - a.score);
  const out: ResolvedTool[] = [];
  const seen = new Set<string>();
  for (const { t } of scored) {
    if (seen.has(t.slug)) continue;
    seen.add(t.slug);
    out.push(t);
    if (out.length >= limit) break;
  }
  return out;
}

function subcategoryMatch(a: ResolvedTool, b: ResolvedTool): boolean {
  if (!a.subcategory || !b.subcategory) return false;
  return a.subcategory === b.subcategory;
}
