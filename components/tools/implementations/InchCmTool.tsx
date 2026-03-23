"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { INCH_TO_CM, cmToInch, inchToCm } from "@/lib/calculations/unitConvert";
import { formatNumber, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "inch" | "cm";

type InchCmToolProps = { tool: ResolvedTool };

export function InchCmTool({ tool }: InchCmToolProps) {
  const [mode, setMode] = useState<Mode>("inch");
  const [raw, setRaw] = useState("10");

  const parsed = useMemo(() => parseAmount(raw), [raw]);

  const error = useMemo(() => {
    if (raw.trim() === "") return undefined;
    if (parsed === null) return "숫자만 입력할 수 있습니다.";
    if (parsed < 0) return "0 이상만 입력할 수 있습니다.";
    return undefined;
  }, [raw, parsed]);

  const out = useMemo(() => {
    if (parsed === null || parsed < 0) return null;
    if (mode === "inch") {
      const cm = inchToCm(parsed);
      return {
        primaryLabel: "cm",
        primaryNum: cm,
        rows: [
          { label: "입력 (in)", value: formatNumber(parsed, 6) },
          { label: "결과 (cm)", value: formatNumber(cm, 6) },
        ],
      };
    }
    const inch = cmToInch(parsed);
    return {
      primaryLabel: "인치",
      primaryNum: inch,
      rows: [
        { label: "입력 (cm)", value: formatNumber(parsed, 6) },
        { label: "결과 (in)", value: formatNumber(inch, 6) },
      ],
    };
  }, [mode, parsed]);

  const copyText = useMemo(() => {
    if (!out || parsed === null) return "";
    return [...out.rows.map((r) => `${r.label}: ${r.value}`), `기준: 1 in = ${INCH_TO_CM} cm`].join("\n");
  }, [out, parsed]);

  const handleReset = useCallback(() => {
    setRaw("");
    setMode("inch");
  }, []);

  const handleExample = useCallback(() => {
    if (mode === "inch") setRaw("12");
    else setRaw("30.48");
  }, [mode]);

  const hasResult = out && !error;

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("inch")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "inch"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              인치 → cm
            </button>
            <button
              type="button"
              onClick={() => setMode("cm")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "cm"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              cm → 인치
            </button>
          </div>
          <FormField
            label={mode === "inch" ? "인치 (in)" : "센티미터 (cm)"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            inputMode="decimal"
            placeholder={mode === "inch" ? "예: 10" : "예: 25.4"}
            helperText="1 in = 2.54 cm"
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
