"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import {
  normalizeWhitespace,
  type WhitespaceMode,
} from "@/lib/calculations/whitespace";
import { formatNumber } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const SAMPLE = `첫 줄입니다.
두 번째 줄입니다.    연속 공백
세 줄`;

type WhitespaceToolProps = {
  tool: ResolvedTool;
};

export function WhitespaceTool({ tool }: WhitespaceToolProps) {
  const [text, setText] = useState("줄이\n여러\n개\n있습니다.");
  const [mode, setMode] = useState<WhitespaceMode>("breaksToSpace");
  const [trimEdges, setTrimEdges] = useState(true);

  const output = useMemo(
    () => normalizeWhitespace(text, mode, trimEdges),
    [text, mode, trimEdges],
  );

  const copyText = output;

  const handleReset = useCallback(() => {
    setText("");
    setMode("breaksToSpace");
    setTrimEdges(true);
  }, []);

  const handleExample = useCallback(() => {
    setText(SAMPLE);
    setMode("breaksToSpace");
    setTrimEdges(true);
  }, []);

  const usageSlot = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        사용 방법
      </summary>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
        <li>
          <strong className="text-[var(--foreground)]">줄바꿈 → 공백</strong>: 복사한 문단을 한 줄로
          붙일 때 자주 씁니다.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">줄바꿈 제거</strong>: 개행만 제거하고 나머지는
          유지합니다.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">공백 정리</strong>: 공백·탭·줄바꿈 등 연속
          공백을 한 칸으로 합칩니다.
        </li>
        <li>앞뒤 공백 제거를 켜면 결과 전체를 trim 합니다.</li>
      </ul>
    </details>
  );

  const preview =
    output.length > 120 ? `${output.slice(0, 120)}…` : output || "(빈 결과)";

  return (
    <ToolPageLayout
      tool={tool}
      usageSlot={usageSlot}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["breaksToSpace", "줄바꿈 → 공백"],
                ["removeBreaks", "줄바꿈만 제거"],
                ["collapseSpace", "공백·줄 정리"],
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
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={trimEdges}
              onChange={(e) => setTrimEdges(e.target.checked)}
              className="size-4 rounded border-[var(--border)]"
            />
            앞뒤 공백 제거 (trim)
          </label>
          <FormTextarea
            label="원문"
            value={text}
            onChange={(e) => setText(e.target.value)}
            helperText="붙여 넣은 직후부터 결과가 갱신됩니다."
          />
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        <div className="space-y-4">
          <ResultCard
            primaryLabel="결과 길이"
            primaryValue={`${formatNumber(output.length)}자`}
            copyText={copyText}
            description={`미리보기: ${preview}`}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              정리된 텍스트 (전체)
            </label>
            <textarea
              readOnly
              value={output}
              className="w-full min-h-[140px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 font-mono text-sm text-[var(--foreground)]"
              aria-label="정리된 텍스트 전체"
            />
          </div>
        </div>
      }
    />
  );
}
