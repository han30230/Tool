"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber } from "@/lib/format/ko";
import { kmPerLToLPer100km, lPer100kmToKmPerL } from "@/lib/calculations/fuel";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "kmpl" | "l100";

type FuelConverterToolProps = { tool: ResolvedTool };

export function FuelConverterTool({ tool }: FuelConverterToolProps) {
  const [mode, setMode] = useState<Mode>("kmpl");
  const [raw, setRaw] = useState("15");

  const v = useMemo(() => parseFloat(raw.replace(/,/g, "")), [raw]);

  const err = useMemo(() => {
    if (raw.trim() === "") return undefined;
    if (!Number.isFinite(v) || v <= 0 || v > 999) return "값을 확인하세요.";
    return undefined;
  }, [raw, v]);

  const result = useMemo(() => {
    if (err || !Number.isFinite(v)) return null;
    if (mode === "kmpl") {
      const l100 = kmPerLToLPer100km(v);
      return { label: "L/100km", value: l100 != null ? formatNumber(l100, 2) : "—" };
    }
    const kmpl = lPer100kmToKmPerL(v);
    return { label: "km/L", value: kmpl != null ? formatNumber(kmpl, 2) : "—" };
  }, [mode, v, err]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("kmpl")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${mode === "kmpl" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
            >
              km/L → L/100km
            </button>
            <button
              type="button"
              onClick={() => setMode("l100")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${mode === "l100" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
            >
              L/100km → km/L
            </button>
          </div>
          <FormField
            label={mode === "kmpl" ? "연비 (km/L)" : "연비 (L/100km)"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            inputMode="decimal"
          />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar onReset={() => setRaw("")} onExample={() => setRaw("15")} />
        </div>
      }
      resultSlot={
        result && !err ? (
          <ResultCard
            primaryLabel="변환 결과"
            primaryValue={result.value}
            copyText={`${result.label}: ${result.value}`}
            description="실제 주행·연비 표시 방식은 차량·국가마다 다릅니다."
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            연비를 입력하세요.
          </div>
        )
      }
    />
  );
}
