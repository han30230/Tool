import type { ResolvedTool } from "@/content/tools/types";

export type ToolSortMode = "popular" | "alpha" | "new";

export function sortTools(list: ResolvedTool[], mode: ToolSortMode): ResolvedTool[] {
  const copy = [...list];
  if (mode === "popular") {
    copy.sort(
      (a, b) =>
        b.popularityWeight - a.popularityWeight ||
        a.sortOrder - b.sortOrder ||
        a.title.localeCompare(b.title, "ko"),
    );
  } else if (mode === "alpha") {
    copy.sort((a, b) => a.title.localeCompare(b.title, "ko"));
  } else {
    copy.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.popularityWeight - a.popularityWeight || a.title.localeCompare(b.title, "ko"));
  }
  return copy;
}
