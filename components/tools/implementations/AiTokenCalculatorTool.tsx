"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

function estimateTokens(text: string): number {
  const chars = [...text].length;
  if (chars === 0) return 0;
  return Math.max(1, Math.ceil(chars / 3.6));
}

type AiTokenCalculatorToolProps = { tool: ResolvedTool };

export function AiTokenCalculatorTool({ tool }: AiTokenCalculatorToolProps) {
  const [text, setText] = useState("프롬프트나 문서를 입력하면 대략적인 토큰 수를 계산합니다.");
  const chars = useMemo(() => [...text].length, [text]);
  const tokens = useMemo(() => estimateTokens(text), [text]);
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormTextarea label="텍스트 입력" value={text} onChange={(e) => setText(e.target.value)} className="min-h-[140px]" />
          <ToolActionBar onReset={() => setText("")} onExample={() => setText("LLM API 입력 길이를 미리 점검하고 비용을 추정할 수 있습니다.")} />
        </div>
      }
      resultSlot={
        <ResultCard
          primaryLabel="추정 토큰 수"
          primaryValue={`${formatNumber(tokens)} tokens`}
          copyText={`추정 토큰: ${tokens}\n문자 수: ${chars}\n단어 수: ${words}`}
          description="한국어·영문 혼합 텍스트 기준의 대략치이며 모델별 실제 토큰 수와 다를 수 있습니다."
          extraRows={[
            { label: "문자 수", value: formatNumber(chars) },
            { label: "단어 수", value: formatNumber(words) },
          ]}
        />
      }
    />
  );
}

