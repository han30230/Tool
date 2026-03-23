"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type PromptLengthToolProps = { tool: ResolvedTool };

export function PromptLengthTool({ tool }: PromptLengthToolProps) {
  const [text, setText] = useState("이 프롬프트가 모델 컨텍스트 길이에 맞는지 확인합니다.");
  const [contextRaw, setContextRaw] = useState("8000");
  const chars = useMemo(() => [...text].length, [text]);
  const estTokens = useMemo(() => Math.max(0, Math.ceil(chars / 3.6)), [chars]);
  const context = useMemo(() => Math.max(1, parseInt(contextRaw.replace(/\D/g, ""), 10) || 8000), [contextRaw]);
  const ratio = useMemo(() => (estTokens / context) * 100, [estTokens, context]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="모델 컨텍스트 길이(tokens)" value={contextRaw} onChange={(e) => setContextRaw(e.target.value)} inputMode="numeric" />
          <FormTextarea label="프롬프트" value={text} onChange={(e) => setText(e.target.value)} className="min-h-[140px]" />
          <ToolActionBar onReset={() => setText("")} onExample={() => setText("역할, 제약조건, 출력형식, 예시를 포함해 프롬프트를 구조화하세요.")} />
        </div>
      }
      resultSlot={
        <ResultCard
          primaryLabel="컨텍스트 사용률"
          primaryValue={`${formatNumber(ratio, 2)}%`}
          copyText={`추정 토큰: ${estTokens}\n컨텍스트: ${context}\n사용률: ${ratio.toFixed(2)}%`}
          description={ratio > 90 ? "컨텍스트 한도에 매우 근접했습니다." : "여유 범위를 포함한 참고 수치입니다."}
          extraRows={[
            { label: "추정 토큰", value: `${formatNumber(estTokens)} tokens` },
            { label: "컨텍스트 한도", value: `${formatNumber(context)} tokens` },
          ]}
        />
      }
    />
  );
}

