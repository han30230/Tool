"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { calculateTakeHome } from "@/lib/calculations/takeHome";
import { formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "annual" | "monthly";

type TakeHomePayToolProps = {
  tool: ResolvedTool;
};

export function TakeHomePayTool({ tool }: TakeHomePayToolProps) {
  const [mode, setMode] = useState<Mode>("annual");
  const [rawGross, setRawGross] = useState("48000000");
  const [rawDeps, setRawDeps] = useState("1");
  const [rawNonTax, setRawNonTax] = useState("0");

  const gross = useMemo(() => parseAmount(rawGross), [rawGross]);
  const deps = useMemo(() => {
    const n = parseInt(rawDeps.replace(/\D/g, ""), 10);
    if (!Number.isFinite(n)) return null;
    return Math.min(7, Math.max(0, n));
  }, [rawDeps]);
  const nonTax = useMemo(() => parseAmount(rawNonTax) ?? 0, [rawNonTax]);

  const err = useMemo(() => {
    if (rawGross.trim() === "") return undefined;
    if (gross === null || gross <= 0) return "세전 금액은 0보다 커야 합니다.";
    if (deps === null) return "부양가족 수는 0~7 사이 정수로 입력하세요.";
    return undefined;
  }, [rawGross, gross, deps]);

  const result = useMemo(() => {
    if (gross === null || gross <= 0 || deps === null) return null;
    return calculateTakeHome({
      mode,
      grossAmount: gross,
      dependents: deps,
      nontaxableMonthly: nonTax,
    });
  }, [mode, gross, deps, nonTax]);

  const copyText = useMemo(() => {
    if (!result) return "";
    return [
      `세전 월급: ${formatWon(result.grossMonthly)}`,
      `국민연금: ${formatWon(result.nationalPension)}`,
      `건강보험: ${formatWon(result.healthInsurance)}`,
      `장기요양: ${formatWon(result.longTermCare)}`,
      `고용보험: ${formatWon(result.employmentInsurance)}`,
      `소득세(월): ${formatWon(result.incomeTaxMonthly)}`,
      `지방소득세(월): ${formatWon(result.localTaxMonthly)}`,
      `예상 실수령(월): ${formatWon(result.netMonthly)}`,
    ].join("\n");
  }, [result]);

  const handleReset = useCallback(() => {
    setRawGross("");
    setRawDeps("0");
    setRawNonTax("0");
    setMode("annual");
  }, []);

  const handleExample = useCallback(() => {
    setMode("annual");
    setRawGross("48000000");
    setRawDeps("1");
    setRawNonTax("200000");
  }, []);

  const tabCls = (m: Mode) =>
    `min-h-[44px] rounded-xl px-4 py-2 text-sm font-semibold transition ${
      mode === m
        ? "bg-[var(--accent)] text-white shadow-md"
        : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
    }`;

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setMode("annual")} className={tabCls("annual")}>
              세전 연봉 기준
            </button>
            <button type="button" onClick={() => setMode("monthly")} className={tabCls("monthly")}>
              세전 월급 기준
            </button>
          </div>
          <FormField
            label={mode === "annual" ? "세전 연봉 (원)" : "세전 월급 (원)"}
            value={rawGross}
            onChange={(e) => setRawGross(e.target.value)}
            inputMode="decimal"
            placeholder={mode === "annual" ? "예: 48000000" : "예: 4000000"}
            helperText="원 단위 숫자만 입력합니다."
            error={err}
          />
          <FormField
            label="부양가족 수 (본인 제외, 0~7)"
            value={rawDeps}
            onChange={(e) => setRawDeps(e.target.value)}
            inputMode="numeric"
            placeholder="예: 1"
            helperText="배우자·부양가족 등 인적공제 대상 인원을 대략 넣습니다."
          />
          <FormField
            label="월 비과세액 (원, 없으면 0)"
            value={rawNonTax}
            onChange={(e) => setRawNonTax(e.target.value)}
            inputMode="decimal"
            placeholder="예: 200000"
            helperText="식대 등 비과세 급여를 월 기준으로 합산해 넣습니다. 없으면 0."
          />
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        result && !err ? (
          <ResultCard
            primaryLabel="예상 실수령액 (월)"
            primaryValue={formatWon(result.netMonthly)}
            copyText={copyText}
            description="4대보험 요율·과세표준은 단순 모델이며, 실제 급여명세와 다를 수 있습니다."
            extraRows={[
              { label: "세전 월급", value: formatWon(result.grossMonthly) },
              { label: "국민연금", value: formatWon(result.nationalPension) },
              { label: "건강보험", value: formatWon(result.healthInsurance) },
              { label: "장기요양", value: formatWon(result.longTermCare) },
              { label: "고용보험", value: formatWon(result.employmentInsurance) },
              { label: "소득세(월 추정)", value: formatWon(result.incomeTaxMonthly) },
              { label: "지방소득세(월 추정)", value: formatWon(result.localTaxMonthly) },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            금액을 입력하면 예상 실수령액과 공제 항목이 표시됩니다.
          </div>
        )
      }
    />
  );
}
