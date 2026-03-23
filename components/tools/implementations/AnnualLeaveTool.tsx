"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { calculateAnnualLeave } from "@/lib/calculations/annualLeave";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

function todayYmd(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type AnnualLeaveToolProps = {
  tool: ResolvedTool;
};

export function AnnualLeaveTool({ tool }: AnnualLeaveToolProps) {
  const [hire, setHire] = useState("2022-03-01");
  const [asOf, setAsOf] = useState(todayYmd);
  const [usedRaw, setUsedRaw] = useState("5");

  const used = useMemo(() => {
    const n = parseFloat(usedRaw.replace(/,/g, ""));
    if (!Number.isFinite(n) || n < 0) return null;
    return n;
  }, [usedRaw]);

  const err = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(hire)) return "입사일 형식을 확인하세요.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return "기준일 형식을 확인하세요.";
    if (used === null) return "사용 연차는 0 이상 숫자로 입력하세요.";
    return undefined;
  }, [hire, asOf, used]);

  const result = useMemo(() => {
    if (used === null) return null;
    return calculateAnnualLeave({
      hireYmd: hire,
      asOfYmd: asOf,
      usedDays: used,
    });
  }, [hire, asOf, used]);

  const copyText = useMemo(() => {
    if (!result) return "";
    return [
      `발생 연차: ${result.accruedDays}일`,
      `사용: ${result.usedDays}일`,
      `잔여: ${result.remainingDays}일`,
    ].join("\n");
  }, [result]);

  const handleReset = useCallback(() => {
    setHire("");
    setAsOf(todayYmd());
    setUsedRaw("0");
  }, []);

  const handleExample = useCallback(() => {
    setHire("2022-03-01");
    setAsOf(todayYmd());
    setUsedRaw("5");
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
            placeholder="2022-03-01"
          />
          <FormField
            label="기준일 (YYYY-MM-DD)"
            value={asOf}
            onChange={(e) => setAsOf(e.target.value)}
            placeholder={todayYmd()}
            helperText="오늘 또는 연차를 계산하고 싶은 날짜를 넣습니다."
          />
          <FormField
            label="사용한 연차 (일)"
            value={usedRaw}
            onChange={(e) => setUsedRaw(e.target.value)}
            inputMode="decimal"
            placeholder="예: 5"
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
            primaryLabel="잔여 연차 (일, 참고)"
            primaryValue={`${result.remainingDays}일`}
            copyText={copyText}
            description={
              result.noteKey === "under1y"
                ? "입사 후 1년 미만 구간은 월 단위 발생을 단순화한 값입니다. 회사 취업규칙·근로계약을 확인하세요."
                : "1년 이상 구간은 15일 + 2년마다 1일 가산(최대 25일)을 단순화했습니다."
            }
            extraRows={[
              { label: "발생 연차(추정)", value: `${result.accruedDays}일` },
              { label: "사용", value: `${result.usedDays}일` },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            입사일과 기준일을 입력하면 잔여 연차 추정치가 표시됩니다.
          </div>
        )
      }
    />
  );
}
