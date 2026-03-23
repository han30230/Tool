"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { slugifyText } from "@/lib/text/slugify";
import { toSentenceCaseLines, toTitleCase } from "@/lib/text/caseConvert";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "slug" | "upper" | "lower" | "title" | "sentence";

type SlugifyToolProps = { tool: ResolvedTool };

function applyMode(raw: string, mode: Mode): string {
  switch (mode) {
    case "slug":
      return slugifyText(raw);
    case "upper":
      return raw.toLocaleUpperCase("ko-KR");
    case "lower":
      return raw.toLocaleLowerCase("ko-KR");
    case "title":
      return toTitleCase(raw);
    case "sentence":
      return toSentenceCaseLines(raw);
    default:
      return raw;
  }
}

export function SlugifyTool({ tool }: SlugifyToolProps) {
  const [raw, setRaw] = useState("My Blog Post 제목");
  const [mode, setMode] = useState<Mode>("slug");

  const out = useMemo(() => applyMode(raw, mode), [raw, mode]);

  const modeLabel =
    mode === "slug"
      ? "슬러그"
      : mode === "upper"
        ? "대문자"
        : mode === "lower"
          ? "소문자"
          : mode === "title"
            ? "단어별 첫 글자"
            : "문장형(줄별)";

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["slug", "슬러그"],
                ["upper", "대문자"],
                ["lower", "소문자"],
                ["title", "Title"],
                ["sentence", "문장형"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-medium ${
                  mode === id
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <FormTextarea label="원문" value={raw} onChange={(e) => setRaw(e.target.value)} className="min-h-[120px]" />
          <ToolActionBar onReset={() => setRaw("")} onExample={() => setRaw("Hello World 2025")} />
        </div>
      }
      resultSlot={
        <ResultCard
          primaryLabel={modeLabel}
          primaryValue={out || "(빈 값)"}
          copyText={out}
          description="슬러그 모드는 한글·기호가 많이 제거될 수 있습니다."
        />
      }
    />
  );
}
