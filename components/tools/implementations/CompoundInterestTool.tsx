"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { calculateCompoundInterest } from "@/lib/calculations/compound";
import { formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const COMPOUND_OPTIONS: { value: string; label: string }[] = [
  { value: "1", label: "연 1회" },
  { value: "2", label: "반기" },
  { value: "4", label: "분기" },
  { value: "12", label: "월" },
  { value: "365", label: "일(참고)" },
];

type CompoundInterestToolProps = { tool: ResolvedTool };

export function CompoundInterestTool({ tool }: CompoundInterestToolProps) {
  const [principal, setPrincipal] = useState("10000000");
  const [rate, setRate] = useState("3.5");
  const [years, setYears] = useState("5");
  const [compound, setCompound] = useState("12");

  const p = useMemo(() => parseAmount(principal), [principal]);
  const r = useMemo(() => parseFloat(rate.replace(/,/g, "")), [rate]);
  const y = useMemo(() => parseFloat(years.replace(/,/g, "")), [years]);
  const n = useMemo(() => parseInt(compound, 10), [compound]);

  const err = useMemo(() => {
    if (principal.trim() === "") return undefined;
    if (p === null || p < 0) return "원금을 입력하세요.";
    if (!Number.isFinite(r) || r < 0 || r > 100) return "연이율은 0~100% 사이로 입력하세요.";
    if (!Number.isFinite(y) || y < 0 || y > 100) return "기간은 0~100년 사이로 입력하세요.";
    return undefined;
  }, [principal, p, r, y]);

  const result = useMemo(() => {
    if (p === null || err) return null;
    return calculateCompoundInterest(p, r, y, n);
  }, [p, r, y, n, err]);

  const copyText = useMemo(() => {
    if (!result) return "";
    return `만기 예상액: ${formatWon(result.futureValue)}\n이자 합계: ${formatWon(result.interest)}`;
  }, [result]);

  const handleReset = useCallback(() => {
    setPrincipal("");
    setRate("");
    setYears("");
    setCompound("12");
  }, []);

  const handleExample = useCallback(() => {
    setPrincipal("10000000");
    setRate("3.5");
    setYears("5");
    setCompound("12");
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="원금 (원)"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            inputMode="decimal"
          />
          <FormField
            label="연이율 (%)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            inputMode="decimal"
          />
          <FormField
            label="기간 (년)"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            inputMode="decimal"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
              복리 주기
            </label>
            <select
              value={compound}
              onChange={(e) => setCompound(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-base text-[var(--foreground)] shadow-[var(--shadow-sm)] outline-none focus:border-[var(--accent)]/40 focus:shadow-[var(--shadow-md)]"
            >
              {COMPOUND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
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
            primaryLabel="만기 예상액"
            primaryValue={formatWon(result.futureValue)}
            copyText={copyText}
            description="세금·수수료·인플레이션은 반영하지 않습니다."
            extraRows={[{ label: "이자 합계(추정)", value: formatWon(result.interest) }]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            원금·금리·기간을 입력하면 복리 결과가 표시됩니다.
          </div>
        )
      }
    />
  );
}
