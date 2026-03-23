"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { analyzeText } from "@/lib/calculations/textStats";
import { formatNumber } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const EXAMPLE = `안녕하세요. 글자 수 세기 예시입니다.
두 번째 줄입니다.`;

type CharCountToolProps = {
  tool: ResolvedTool;
};

export function CharCountTool({ tool }: CharCountToolProps) {
  const [text, setText] = useState(
    "안녕하세요. 공백 포함·제외 글자 수와 단어 수를 확인해 보세요.",
  );

  const stats = useMemo(() => analyzeText(text), [text]);

  const copyText = useMemo(() => {
    return [
      `공백 포함 글자: ${formatNumber(stats.charsWithSpaces)}`,
      `공백 제외 글자: ${formatNumber(stats.charsNoSpaces)}`,
      `단어 수: ${formatNumber(stats.words)}`,
      `줄 수: ${formatNumber(stats.lines)}`,
      `UTF-8 바이트: ${formatNumber(stats.bytesUtf8)}`,
    ].join("\n");
  }, [stats]);

  const handleReset = useCallback(() => {
    setText("");
  }, []);

  const handleExample = useCallback(() => {
    setText(EXAMPLE);
  }, []);

  const usageSlot = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        사용 방법
      </summary>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
        <li>텍스트를 붙여 넣으면 브라우저에서 즉시 길이를 셉니다.</li>
        <li>
          <strong className="text-[var(--foreground)]">단어 수</strong>는 공백으로 나눈 덩어리 수에
          가깝습니다. 한글은 띄어쓰기 기준입니다.
        </li>
        <li>입력 내용은 서버로 전송하지 않습니다.</li>
      </ul>
    </details>
  );

  return (
    <ToolPageLayout
      tool={tool}
      usageSlot={usageSlot}
      inputSlot={
        <div className="space-y-4">
          <FormTextarea
            label="텍스트"
            value={text}
            onChange={(e) => setText(e.target.value)}
            helperText="모바일에서도 바로 입력할 수 있도록 큰 입력창을 사용했습니다."
          />
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        <ResultCard
          primaryLabel="공백 포함 글자 수"
          primaryValue={formatNumber(stats.charsWithSpaces)}
          copyText={copyText}
          description="아래에 공백 제외·단어·줄·바이트 수를 함께 표시합니다."
          extraRows={[
            { label: "공백 제외 글자", value: formatNumber(stats.charsNoSpaces) },
            { label: "단어 수", value: formatNumber(stats.words) },
            { label: "줄 수", value: formatNumber(stats.lines) },
            { label: "UTF-8 바이트(참고)", value: formatNumber(stats.bytesUtf8) },
          ]}
        />
      }
    />
  );
}
