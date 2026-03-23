"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { PYEONG_TO_SQM, pyeongToSqm, sqmToPyeong } from "@/lib/calculations/area";
import { formatNumber, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "pyeong" | "sqm";

type AreaToolProps = {
  tool: ResolvedTool;
};

export function AreaTool({ tool }: AreaToolProps) {
  const [mode, setMode] = useState<Mode>("pyeong");
  const [raw, setRaw] = useState("33");

  const parsed = useMemo(() => parseAmount(raw), [raw]);

  const error = useMemo(() => {
    if (raw.trim() === "") return undefined;
    if (parsed === null) return "숫자만 입력할 수 있습니다.";
    if (parsed < 0) return "0 이상만 입력할 수 있습니다.";
    return undefined;
  }, [raw, parsed]);

  const out = useMemo(() => {
    if (parsed === null || parsed < 0) return null;
    if (mode === "pyeong") {
      const sqm = pyeongToSqm(parsed);
      return {
        primaryLabel: "㎡",
        primaryNum: sqm,
        rows: [
          { label: "입력 (평)", value: formatNumber(parsed, 6) },
          { label: "결과 (㎡)", value: formatNumber(sqm, 6) },
        ],
      };
    }
    const py = sqmToPyeong(parsed);
    return {
      primaryLabel: "평",
      primaryNum: py,
      rows: [
        { label: "입력 (㎡)", value: formatNumber(parsed, 6) },
        { label: "결과 (평)", value: formatNumber(py, 6) },
      ],
    };
  }, [mode, parsed]);

  const copyText = useMemo(() => {
    if (!out || parsed === null) return "";
    return [
      ...out.rows.map((r) => `${r.label}: ${r.value}`),
      `환산: 1평 = ${PYEONG_TO_SQM}㎡`,
    ].join("\n");
  }, [out, parsed]);

  const handleReset = useCallback(() => {
    setRaw("");
    setMode("pyeong");
  }, []);

  const handleExample = useCallback(() => {
    if (mode === "pyeong") {
      setRaw("33");
    } else {
      setRaw("99.173");
    }
  }, [mode]);

  const usageSlot = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        사용 방법
      </summary>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
        <li>
          <strong className="text-[var(--foreground)]">평 → ㎡</strong>: 평을 입력하면 ㎡로 변환합니다.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">㎡ → 평</strong>: ㎡를 입력하면 평으로 변환합니다.
        </li>
        <li>1평 = {PYEONG_TO_SQM}㎡ 로 계산합니다. 법적·계약용은 별도 확인이 필요합니다.</li>
      </ul>
    </details>
  );

  const hasResult = out && !error;

  return (
    <ToolPageLayout
      tool={tool}
      usageSlot={usageSlot}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("pyeong")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "pyeong"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              평 → ㎡
            </button>
            <button
              type="button"
              onClick={() => setMode("sqm")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "sqm"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              ㎡ → 평
            </button>
          </div>
          <FormField
            label={mode === "pyeong" ? "평" : "제곱미터 (㎡)"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            inputMode="decimal"
            placeholder={mode === "pyeong" ? "예: 33" : "예: 99.173"}
            helperText="소수 입력 가능합니다."
            error={error}
          />
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        hasResult ? (
          <ResultCard
            primaryLabel={`변환 (${out.primaryLabel})`}
            primaryValue={formatNumber(out.primaryNum, 6)}
            copyText={copyText}
            description="입력이 바뀔 때마다 즉시 다시 계산됩니다."
            extraRows={out.rows}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
            숫자를 입력하면 실시간으로 변환됩니다.
          </div>
        )
      }
    />
  );
}
