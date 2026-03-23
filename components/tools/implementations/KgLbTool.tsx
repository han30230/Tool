"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { KG_TO_LB, kgToLb, lbToKg } from "@/lib/calculations/unitConvert";
import { formatNumber, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "kg" | "lb";

type KgLbToolProps = { tool: ResolvedTool };

export function KgLbTool({ tool }: KgLbToolProps) {
  const [mode, setMode] = useState<Mode>("kg");
  const [raw, setRaw] = useState("70");

  const parsed = useMemo(() => parseAmount(raw), [raw]);

  const error = useMemo(() => {
    if (raw.trim() === "") return undefined;
    if (parsed === null) return "숫자만 입력할 수 있습니다.";
    if (parsed < 0) return "0 이상만 입력할 수 있습니다.";
    return undefined;
  }, [raw, parsed]);

  const out = useMemo(() => {
    if (parsed === null || parsed < 0) return null;
    if (mode === "kg") {
      const lb = kgToLb(parsed);
      return {
        primaryLabel: "lb",
        primaryNum: lb,
        rows: [
          { label: "입력 (kg)", value: formatNumber(parsed, 6) },
          { label: "결과 (lb)", value: formatNumber(lb, 6) },
        ],
      };
    }
    const kg = lbToKg(parsed);
    return {
      primaryLabel: "kg",
      primaryNum: kg,
      rows: [
        { label: "입력 (lb)", value: formatNumber(parsed, 6) },
        { label: "결과 (kg)", value: formatNumber(kg, 6) },
      ],
    };
  }, [mode, parsed]);

  const copyText = useMemo(() => {
    if (!out || parsed === null) return "";
    return [...out.rows.map((r) => `${r.label}: ${r.value}`), `참고: 1 lb ≈ ${(1 / KG_TO_LB).toFixed(6)} kg`].join(
      "\n",
    );
  }, [out, parsed]);

  const handleReset = useCallback(() => {
    setRaw("");
    setMode("kg");
  }, []);

  const handleExample = useCallback(() => {
    if (mode === "kg") setRaw("70");
    else setRaw("154");
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
              onClick={() => setMode("kg")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "kg"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              kg → lb
            </button>
            <button
              type="button"
              onClick={() => setMode("lb")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "lb"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              lb → kg
            </button>
          </div>
          <FormField
            label={mode === "kg" ? "킬로그램 (kg)" : "파운드 (lb)"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            inputMode="decimal"
            placeholder={mode === "kg" ? "예: 70" : "예: 150"}
            helperText="상수 기반 근사 환산입니다."
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
