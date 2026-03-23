"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type TitleLengthToolProps = { tool: ResolvedTool };

export function TitleLengthTool({ tool }: TitleLengthToolProps) {
  const [text, setText] = useState("");
  const [limitRaw, setLimitRaw] = useState("60");
  const limit = useMemo(() => Math.max(1, parseInt(limitRaw.replace(/\D/g, ""), 10) || 60), [limitRaw]);
  const chars = useMemo(() => [...text].length, [text]);
  const remain = limit - chars;

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[var(--foreground)]">
            기준 길이
            <input
              value={limitRaw}
              onChange={(e) => setLimitRaw(e.target.value)}
              inputMode="numeric"
              className="mt-2 w-full min-h-[44px] rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2"
            />
          </label>
          <FormTextarea label="제목 문구" value={text} onChange={(e) => setText(e.target.value)} className="min-h-[120px]" />
          <ToolActionBar onReset={() => { setText(""); setLimitRaw("60"); }} onExample={() => setText("2026년 최신 스마트스토어 판매 수수료 계산 가이드")} />
        </div>
      }
      resultSlot={
        <ResultCard
          primaryLabel="제목 길이"
          primaryValue={`${chars}자`}
          copyText={`제목 길이: ${chars}자\n기준: ${limit}자\n남은 수: ${remain}자`}
          description={remain >= 0 ? `기준까지 ${remain}자 남았습니다.` : `${-remain}자 초과되었습니다.`}
          extraRows={[
            { label: "기준", value: `${limit}자` },
            { label: "남은/초과", value: `${remain >= 0 ? `+${remain}` : remain}자` },
          ]}
        />
      }
    />
  );
}

