"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { celsiusToFahrenheit, fahrenheitToCelsius } from "@/lib/calculations/unitConvert";
import { formatNumber, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "c" | "f";

type CelsiusFahrenheitToolProps = { tool: ResolvedTool };

export function CelsiusFahrenheitTool({ tool }: CelsiusFahrenheitToolProps) {
  const [mode, setMode] = useState<Mode>("c");
  const [raw, setRaw] = useState("25");

  const parsed = useMemo(() => parseAmount(raw), [raw]);

  const error = useMemo(() => {
    if (raw.trim() === "") return undefined;
    if (parsed === null) return "숫자만 입력할 수 있습니다.";
    return undefined;
  }, [raw, parsed]);

  const out = useMemo(() => {
    if (parsed === null) return null;
    if (mode === "c") {
      const f = celsiusToFahrenheit(parsed);
      return {
        primaryLabel: "℉",
        primaryNum: f,
        rows: [
          { label: "입력 (℃)", value: formatNumber(parsed, 4) },
          { label: "결과 (℉)", value: formatNumber(f, 4) },
        ],
      };
    }
    const c = fahrenheitToCelsius(parsed);
    return {
      primaryLabel: "℃",
      primaryNum: c,
      rows: [
        { label: "입력 (℉)", value: formatNumber(parsed, 4) },
        { label: "결과 (℃)", value: formatNumber(c, 4) },
      ],
    };
  }, [mode, parsed]);

  const copyText = useMemo(() => {
    if (!out || parsed === null) return "";
    return [...out.rows.map((r) => `${r.label}: ${r.value}`)].join("\n");
  }, [out, parsed]);

  const handleReset = useCallback(() => {
    setRaw("");
    setMode("c");
  }, []);

  const handleExample = useCallback(() => {
    if (mode === "c") setRaw("0");
    else setRaw("32");
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
              onClick={() => setMode("c")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "c"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              ℃ → ℉
            </button>
            <button
              type="button"
              onClick={() => setMode("f")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "f"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              ℉ → ℃
            </button>
          </div>
          <FormField
            label={mode === "c" ? "섭씨 (℃)" : "화씨 (℉)"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            inputMode="decimal"
            placeholder={mode === "c" ? "예: 25" : "예: 77"}
            helperText="℉ = ℃×9/5+32"
            error={error}
          />
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        hasResult ? (
          <ResultCard
            primaryLabel={`변환 (${out.primaryLabel})`}
            primaryValue={formatNumber(out.primaryNum, 4)}
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
