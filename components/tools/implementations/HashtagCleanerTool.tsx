"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type HashtagCleanerToolProps = { tool: ResolvedTool };

function normalizeTag(raw: string): string {
  const t = raw.trim().replace(/^#+/, "");
  if (!t) return "";
  return `#${t.replace(/\s+/g, "")}`;
}

export function HashtagCleanerTool({ tool }: HashtagCleanerToolProps) {
  const [raw, setRaw] = useState("#툴모음 #계산기 #툴모음, #마케팅  #SEO");

  const normalized = useMemo(() => {
    const tokens = raw.split(/[\s,]+/).map(normalizeTag).filter(Boolean);
    const unique: string[] = [];
    const seen = new Set<string>();
    for (const t of tokens) {
      const key = t.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(t);
    }
    return unique;
  }, [raw]);

  const out = normalized.join(" ");

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormTextarea
            label="해시태그 입력"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[120px]"
            helperText="공백/쉼표 구분 모두 지원합니다. 중복은 자동 제거됩니다."
          />
          <ToolActionBar onReset={() => setRaw("")} onExample={() => setRaw("#툴모음 #계산기 #툴모음, #마케팅  #SEO")} />
        </div>
      }
      resultSlot={
        <ResultCard
          primaryLabel="정리된 해시태그"
          primaryValue={out || "-"}
          copyText={out}
          description={`총 ${normalized.length}개`}
        />
      }
    />
  );
}

