"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { annualToMonthly, monthlyToAnnual } from "@/lib/calculations/salary";
import { formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "toMonthly" | "toAnnual";

type SalaryToolProps = {
  tool: ResolvedTool;
};

export function SalaryTool({ tool }: SalaryToolProps) {
  const [mode, setMode] = useState<Mode>("toMonthly");
  const [raw, setRaw] = useState("60000000");

  const parsed = useMemo(() => parseAmount(raw), [raw]);

  const error = useMemo(() => {
    if (raw.trim() === "") return undefined;
    if (parsed === null) return "숫자만 입력할 수 있습니다.";
    if (parsed < 0) return "0원 이상만 입력할 수 있습니다.";
    return undefined;
  }, [raw, parsed]);

  const result = useMemo(() => {
    if (parsed === null || parsed < 0) return NaN;
    return mode === "toMonthly" ? annualToMonthly(parsed) : monthlyToAnnual(parsed);
  }, [mode, parsed]);

  const copyText = useMemo(() => {
    if (!Number.isFinite(result)) return "";
    if (mode === "toMonthly") {
      return `연봉(세전): ${formatWon(parsed!)}\n월급(세전, ÷12): ${formatWon(result)}`;
    }
    return `월급(세전): ${formatWon(parsed!)}\n연봉(세전, ×12): ${formatWon(result)}`;
  }, [mode, parsed, result]);

  const handleReset = useCallback(() => {
    setRaw("");
    setMode("toMonthly");
  }, []);

  const handleExample = useCallback(() => {
    if (mode === "toMonthly") {
      setRaw("60000000");
    } else {
      setRaw("5000000");
    }
  }, [mode]);

  const usageSlot = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        사용 방법
      </summary>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
        <li>
          <strong className="text-[var(--foreground)]">세전·액면</strong> 기준으로 연봉 ÷ 12, 월급 ×
          12만 수행합니다.
        </li>
        <li>실수령액, 소득세, 4대보험, 비과세 수당 등은 반영하지 않습니다.</li>
        <li>채용 공고·협상 전 빠른 환산용으로 쓰고, 정확한 금액은 회사 안내를 따르세요.</li>
      </ul>
    </details>
  );

  const hasResult = Number.isFinite(result) && !error;

  return (
    <ToolPageLayout
      tool={tool}
      usageSlot={usageSlot}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("toMonthly")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "toMonthly"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              연봉 → 월급
            </button>
            <button
              type="button"
              onClick={() => setMode("toAnnual")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "toAnnual"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              월급 → 연봉
            </button>
          </div>
          <FormField
            label={mode === "toMonthly" ? "연봉 (원, 세전)" : "월급 (원, 세전)"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            inputMode="decimal"
            placeholder={mode === "toMonthly" ? "예: 60000000" : "예: 5000000"}
            helperText="원 단위 숫자만 입력합니다. 쉼표는 무시됩니다."
            error={error}
          />
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        hasResult ? (
          <ResultCard
            primaryLabel={mode === "toMonthly" ? "월급 (세전, ÷12)" : "연봉 (세전, ×12)"}
            primaryValue={formatWon(result)}
            copyText={copyText}
            description={
              mode === "toMonthly"
                ? `입력 연봉 ${formatWon(parsed!)}을 12개월로 나눈 값입니다(원 단위 반올림).`
                : `입력 월급 ${formatWon(parsed!)}에 12를 곱한 값입니다(원 단위 반올림).`
            }
          />
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
            금액을 입력하면 환산 결과가 여기에 표시됩니다.
          </div>
        )
      }
    />
  );
}
