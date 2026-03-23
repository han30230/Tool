"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { calculateWeeklyHoliday } from "@/lib/calculations/weeklyHoliday";
import { formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type WeeklyHolidayPayToolProps = {
  tool: ResolvedTool;
};

export function WeeklyHolidayPayTool({ tool }: WeeklyHolidayPayToolProps) {
  const [hourly, setHourly] = useState("10030");
  const [weeklyH, setWeeklyH] = useState("20");

  const wage = useMemo(() => parseAmount(hourly), [hourly]);
  const hours = useMemo(() => parseAmount(weeklyH), [weeklyH]);

  const err = useMemo(() => {
    if (hourly.trim() === "" || weeklyH.trim() === "") return undefined;
    if (wage === null || wage <= 0) return "시급을 올바르게 입력하세요.";
    if (hours === null || hours <= 0) return "주간 근로시간을 올바르게 입력하세요.";
    if (hours > 168) return "주간 근로시간이 비정상적으로 큽니다.";
    return undefined;
  }, [hourly, weeklyH, wage, hours]);

  const result = useMemo(() => {
    if (wage === null || wage <= 0 || hours === null || hours <= 0) return null;
    return calculateWeeklyHoliday({ hourlyWage: wage, weeklyHours: hours });
  }, [wage, hours]);

  const copyText = useMemo(() => {
    if (!result) return "";
    return [
      `주휴 적용: ${result.eligible ? "예(주 15시간 이상)" : "아니오(주 15시간 미만)"}`,
      `주휴시간: ${result.weeklyHolidayHours}시간`,
      `주휴수당: ${formatWon(result.weeklyHolidayPay)}`,
      `시급×주간근로(참고): ${formatWon(result.weeklyWorkPay)}`,
    ].join("\n");
  }, [result]);

  const handleReset = useCallback(() => {
    setHourly("");
    setWeeklyH("");
  }, []);

  const handleExample = useCallback(() => {
    setHourly("10030");
    setWeeklyH("20");
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="시급 (원)"
            value={hourly}
            onChange={(e) => setHourly(e.target.value)}
            inputMode="decimal"
            placeholder="예: 10030"
            error={err && err.includes("시급") ? err : undefined}
          />
          <FormField
            label="1주 소정근로시간 (시간)"
            value={weeklyH}
            onChange={(e) => setWeeklyH(e.target.value)}
            inputMode="decimal"
            placeholder="예: 20"
            helperText="주 15시간 미만이면 주휴수당이 적용되지 않는 경우가 많습니다."
            error={err && err.includes("근로") ? err : undefined}
          />
          {err && err.includes("비정상") ? (
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
            primaryLabel="예상 주휴수당 (원)"
            primaryValue={formatWon(result.weeklyHolidayPay)}
            copyText={copyText}
            description={
              result.eligible
                ? `주휴시간 ${result.weeklyHolidayHours}시간 × 시급 기준입니다. 개근·계약 형태에 따라 달라질 수 있습니다.`
                : "주 15시간 미만으로 이 계산에서는 주휴를 0으로 둡니다."
            }
            extraRows={[
              {
                label: "주휴 적용(단순)",
                value: result.eligible ? "예" : "아니오",
              },
              { label: "주휴시간(추정)", value: `${result.weeklyHolidayHours}시간` },
              { label: "시급×주간근로", value: formatWon(result.weeklyWorkPay) },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            시급과 주간 근로시간을 입력하면 주휴수당 추정치가 표시됩니다.
          </div>
        )
      }
    />
  );
}
