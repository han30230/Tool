import type { ToolDefinition, ResolvedTool } from "./types";

export function resolveTool(tool: ToolDefinition): ResolvedTool {
  return {
    ...tool,
    keywords: tool.keywords ?? [],
    introText: tool.introText ?? tool.description,
    toolSections: tool.toolSections ?? [],
  };
}
