"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { calculateEqualPaymentLoan } from "@/lib/calculations/loan";
import { formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type LoanToolProps = { tool: ResolvedTool };

export function LoanTool({ tool }: LoanToolProps) {
  const [principal, setPrincipal] = useState("200000000");
  const [rate, setRate] = useState("4.5");
  const [months, setMonths] = useState("240");

  const p = useMemo(() => parseAmount(principal), [principal]);
  const r = useMemo(() => parseFloat(rate.replace(/,/g, "")), [rate]);
  const m = useMemo(() => parseInt(months.replace(/\D/g, ""), 10), [months]);

  const err = useMemo(() => {
    if (principal.trim() === "") return undefined;
    if (p === null || p <= 0) return "대출 원금을 입력하세요.";
    if (!Number.isFinite(r) || r < 0 || r > 50) return "연이율은 0~50% 사이로 입력하세요.";
    if (!Number.isFinite(m) || m < 1 || m > 600) return "상환 개월 수는 1~600 사이로 입력하세요.";
    return undefined;
  }, [principal, p, r, m]);

  const result = useMemo(() => {
    if (p === null) return null;
    return calculateEqualPaymentLoan(p, r, m);
  }, [p, r, m]);

  const copyText = useMemo(() => {
    if (!result) return "";
    return [
      `월 상환액: ${formatWon(result.monthlyPayment)}`,
      `총 상환액: ${formatWon(result.totalPayment)}`,
      `총 이자: ${formatWon(result.totalInterest)}`,
    ].join("\n");
  }, [result]);

  const handleReset = useCallback(() => {
    setPrincipal("");
    setRate("");
    setMonths("");
  }, []);

  const handleExample = useCallback(() => {
    setPrincipal("200000000");
    setRate("4.5");
    setMonths("240");
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="대출 원금 (원)"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            inputMode="decimal"
            helperText="원리금균등 상환 가정"
          />
          <FormField
            label="연이율 (%)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            inputMode="decimal"
            placeholder="4.5"
          />
          <FormField
            label="상환 기간 (개월)"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            inputMode="numeric"
            placeholder="240"
          />
          {err ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {err}
            </p>
          ) : null}
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        result && !err ? (
          <ResultCard
            primaryLabel="월 상환액 (원리금균등)"
            primaryValue={formatWon(result.monthlyPayment)}
            copyText={copyText}
            description="중도상환·금리 변동·취급 수수료는 반영하지 않습니다. 참고용입니다."
            extraRows={[
              { label: "총 상환액", value: formatWon(result.totalPayment) },
              { label: "총 이자", value: formatWon(result.totalInterest) },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            원금·금리·기간을 입력하면 월 상환액이 표시됩니다.
          </div>
        )
      }
    />
  );
}
