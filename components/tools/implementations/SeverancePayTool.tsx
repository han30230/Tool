"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { calculateSeverance } from "@/lib/calculations/severance";
import { formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type SeverancePayToolProps = {
  tool: ResolvedTool;
};

export function SeverancePayTool({ tool }: SeverancePayToolProps) {
  const [hire, setHire] = useState("2020-01-06");
  const [end, setEnd] = useState("2025-01-05");
  const [w3, setW3] = useState("15000000");
  const [bonus, setBonus] = useState("0");
  const [unused, setUnused] = useState("0");

  const parsedW3 = useMemo(() => parseAmount(w3), [w3]);
  const parsedBonus = useMemo(() => parseAmount(bonus) ?? 0, [bonus]);
  const parsedUnused = useMemo(() => parseAmount(unused) ?? 0, [unused]);

  const err = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(hire)) return "입사일을 YYYY-MM-DD 형식으로 입력하세요.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(end)) return "퇴사일을 YYYY-MM-DD 형식으로 입력하세요.";
    if (parsedW3 === null || parsedW3 <= 0) return "최근 3개월 임금 총액을 입력하세요.";
    return undefined;
  }, [hire, end, parsedW3]);

  const result = useMemo(() => {
    if (err) return null;
    return calculateSeverance({
      hireYmd: hire,
      endYmd: end,
      wagesLast3MonthsTotal: parsedW3!,
      bonusLast12Months: parsedBonus,
      unusedLeavePay: parsedUnused,
    });
  }, [err, hire, end, parsedW3, parsedBonus, parsedUnused]);

  const copyText = useMemo(() => {
    if (!result) return "";
    return [
      `재직일수: ${result.workDays}일`,
      `1일 평균임금: ${formatWon(result.averageDailyWage)}`,
      `예상 퇴직금: ${formatWon(result.severancePay)}`,
    ].join("\n");
  }, [result]);

  const handleReset = useCallback(() => {
    setHire("");
    setEnd("");
    setW3("");
    setBonus("0");
    setUnused("0");
  }, []);

  const handleExample = useCallback(() => {
    setHire("2020-01-06");
    setEnd("2025-01-05");
    setW3("15000000");
    setBonus("4000000");
    setUnused("0");
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="입사일 (YYYY-MM-DD)"
            value={hire}
            onChange={(e) => setHire(e.target.value)}
            placeholder="2020-01-06"
            error={undefined}
          />
          <FormField
            label="퇴사일 (YYYY-MM-DD)"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            placeholder="2025-01-05"
          />
          <FormField
            label="최근 3개월 임금 총액 (원)"
            value={w3}
            onChange={(e) => setW3(e.target.value)}
            inputMode="decimal"
            helperText="통상임금 산정 구간의 급여 합계를 넣습니다."
            error={err && err.includes("임금") ? err : undefined}
          />
          <FormField
            label="최근 1년 상여 총액 (원, 선택)"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            inputMode="decimal"
          />
          <FormField
            label="미사용 연차수당 등 (원, 선택)"
            value={unused}
            onChange={(e) => setUnused(e.target.value)}
            inputMode="decimal"
          />
          {(err && !err.includes("임금")) || (!err && result === null) ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {err ?? "날짜를 확인해 주세요."}
            </p>
          ) : null}
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        result && !err ? (
          <ResultCard
            primaryLabel="예상 퇴직금"
            primaryValue={formatWon(result.severancePay)}
            copyText={copyText}
            description={
              result.eligibleOneYearPlus
                ? `재직일수 ${result.workDays}일, 1일 평균임금 ${formatWon(result.averageDailyWage)} 기준 단순 추정입니다.`
                : "계속근로 1년 미만으로 이 모형에서는 퇴직금을 0으로 둡니다. 실제는 소정·사업장에 따라 달라질 수 있습니다."
            }
            extraRows={[
              { label: "재직일수", value: `${result.workDays}일` },
              { label: "1일 평균임금", value: formatWon(result.averageDailyWage) },
              {
                label: "1년 이상 여부(일수 기준)",
                value: result.eligibleOneYearPlus ? "예(365일 이상)" : "아니오",
              },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            입사·퇴사일과 임금을 입력하면 예상 퇴직금이 표시됩니다.
          </div>
        )
      }
    />
  );
}
