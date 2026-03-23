import type { ToolDefinition, ResolvedTool } from "./types";
import { mergeToolMeta } from "./tool-meta";

export function resolveTool(tool: ToolDefinition): ResolvedTool {
  const meta = mergeToolMeta(tool);
  return {
    ...tool,
    ...meta,
    keywords: tool.keywords ?? [],
    introText: tool.introText ?? tool.description,
    toolSections: tool.toolSections ?? [],
    featured: tool.featured ?? false,
    isNew: tool.isNew ?? false,
  };
}
