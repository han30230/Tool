"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { calculateBmi } from "@/lib/calculations/bmi";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type BmiToolProps = { tool: ResolvedTool };

export function BmiTool({ tool }: BmiToolProps) {
  const [h, setH] = useState("170");
  const [w, setW] = useState("65");

  const heightCm = useMemo(() => {
    const n = parseFloat(h.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }, [h]);
  const weightKg = useMemo(() => {
    const n = parseFloat(w.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }, [w]);

  const err = useMemo(() => {
    if (h.trim() === "" || w.trim() === "") return undefined;
    if (heightCm === null || weightKg === null) return "숫자로 입력해 주세요.";
    if (heightCm <= 0 || heightCm > 300) return "키는 1~300cm 범위로 입력해 주세요.";
    if (weightKg <= 0 || weightKg > 500) return "체중은 1~500kg 범위로 입력해 주세요.";
    return undefined;
  }, [h, w, heightCm, weightKg]);

  const result = useMemo(() => {
    if (heightCm === null || weightKg === null) return null;
    if (err) return null;
    return calculateBmi(heightCm, weightKg);
  }, [heightCm, weightKg, err]);

  const copyText = useMemo(() => {
    if (!result) return "";
    return `BMI: ${result.bmi}\n구분: ${result.category}`;
  }, [result]);

  const handleReset = useCallback(() => {
    setH("");
    setW("");
  }, []);

  const handleExample = useCallback(() => {
    setH("170");
    setW("65");
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="키 (cm)"
            value={h}
            onChange={(e) => setH(e.target.value)}
            inputMode="decimal"
            placeholder="170"
            error={err && err.includes("키") ? err : undefined}
          />
          <FormField
            label="체중 (kg)"
            value={w}
            onChange={(e) => setW(e.target.value)}
            inputMode="decimal"
            placeholder="65"
            error={err && err.includes("체중") ? err : undefined}
          />
          {err && !err.includes("키") && !err.includes("체중") ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {err}
            </p>
          ) : null}
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        result ? (
          <ResultCard
            primaryLabel="BMI"
            primaryValue={String(result.bmi)}
            copyText={copyText}
            description={`체질량지수 구분: ${result.category} (대한비만학회 기준 단순 표시, 참고용)`}
            extraRows={[
              { label: "키", value: `${heightCm} cm` },
              { label: "체중", value: `${weightKg} kg` },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            키와 체중을 입력하면 BMI가 표시됩니다.
          </div>
        )
      }
    />
  );
}
