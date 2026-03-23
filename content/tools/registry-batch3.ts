import type { ToolDefinition } from "./types";
import { batch3LifeTools } from "./registry-batch3-part1";
import { batch3RestTools } from "./registry-batch3-part2";

export const batch3Tools: ToolDefinition[] = [...batch3LifeTools, ...batch3RestTools];
