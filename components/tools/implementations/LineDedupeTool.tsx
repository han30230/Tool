"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { dedupeLines } from "@/lib/text/lineDedupe";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type LineDedupeToolProps = { tool: ResolvedTool };

export function LineDedupeTool({ tool }: LineDedupeToolProps) {
  const [raw, setRaw] = useState("apple\nbanana\napple\ncherry\nbanana");
  const [trimForCompare, setTrimForCompare] = useState(true);
  const [ignoreEmpty, setIgnoreEmpty] = useState(true);
  const [caseInsensitive, setCaseInsensitive] = useState(false);

  const out = useMemo(
    () => dedupeLines(raw, { trimForCompare, ignoreEmpty, caseInsensitive }),
    [raw, trimForCompare, ignoreEmpty, caseInsensitive],
  );

  const beforeCount = useMemo(() => {
    const lines = raw.split(/\r?\n/);
    if (ignoreEmpty) return lines.filter((l) => (trimForCompare ? l.trim() : l) !== "").length;
    return lines.length;
  }, [raw, ignoreEmpty, trimForCompare]);

  const afterCount = useMemo(() => {
    if (!out.trim() && ignoreEmpty) return 0;
    return out.split(/\r?\n/).filter((l) => l !== "" || !ignoreEmpty).length;
  }, [out, ignoreEmpty]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormTextarea
            label="목록 (한 줄에 하나)"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[160px] font-mono text-sm"
          />
          <fieldset className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--card-inner)] p-4">
            <legend className="text-sm font-semibold text-[var(--foreground)]">옵션</legend>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={trimForCompare}
                onChange={(e) => setTrimForCompare(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              비교할 때 앞뒤 공백 제거
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={ignoreEmpty}
                onChange={(e) => setIgnoreEmpty(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              빈 줄 무시
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={caseInsensitive}
                onChange={(e) => setCaseInsensitive(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              영문 대소문자 무시하고 중복 판단
            </label>
          </fieldset>
          <ToolActionBar
            onReset={() => setRaw("")}
            onExample={() => setRaw("team-a\nteam-b\nteam-a\nteam-c")}
          />
        </div>
      }
      resultSlot={
        <ResultCard
          primaryLabel="중복 제거 결과"
          primaryValue={out || "(빈 결과)"}
          copyText={out}
          description={`줄 수(유효): 약 ${beforeCount}줄 → ${afterCount}줄 (옵션에 따라 다름)`}
        />
      }
    />
  );
}
