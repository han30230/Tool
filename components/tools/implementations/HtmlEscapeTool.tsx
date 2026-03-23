"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { escapeHtml, unescapeHtml } from "@/lib/text/htmlEscape";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "escape" | "unescape";

type HtmlEscapeToolProps = { tool: ResolvedTool };

export function HtmlEscapeTool({ tool }: HtmlEscapeToolProps) {
  const [mode, setMode] = useState<Mode>("escape");
  const [raw, setRaw] = useState('<div class="box">가격 & 특가</div>');

  const out = useMemo(() => {
    return mode === "escape" ? escapeHtml(raw) : unescapeHtml(raw);
  }, [mode, raw]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            &amp; &lt; &gt; &quot; &#39; 중심으로 변환합니다. 브라우저에서만 처리합니다.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("escape")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "escape"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              이스케이프
            </button>
            <button
              type="button"
              onClick={() => setMode("unescape")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "unescape"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              언이스케이프
            </button>
          </div>
          <FormTextarea
            label={mode === "escape" ? "원문" : "엔티티가 포함된 문자열"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[140px] font-mono text-sm"
          />
          <ToolActionBar
            onReset={() => setRaw("")}
            onExample={() =>
              setRaw(
                mode === "escape"
                  ? '<a href="/">링크 & "인용"</a>'
                  : "&lt;p&gt;문단&lt;/p&gt; &amp; 기호",
              )
            }
          />
        </div>
      }
      resultSlot={
        <ResultCard
          primaryLabel={mode === "escape" ? "이스케이프 결과" : "복원 결과"}
          primaryValue={out || "(빈 값)"}
          copyText={out}
          description="긴 HTML sanitize는 전용 도구·서버 검증이 필요합니다."
        />
      }
    />
  );
}
