"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { hourlyToMonthly, monthlyToHourly } from "@/lib/calculations/hourlyMonthly";
import { formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "toMonthly" | "toHourly";

type HourlyMonthlyToolProps = { tool: ResolvedTool };

export function HourlyMonthlyTool({ tool }: HourlyMonthlyToolProps) {
  const [mode, setMode] = useState<Mode>("toMonthly");
  const [hourly, setHourly] = useState("10030");
  const [monthly, setMonthly] = useState("2000000");
  const [hoursWeek, setHoursWeek] = useState("40");

  const hw = useMemo(() => parseFloat(hoursWeek.replace(/,/g, "")), [hoursWeek]);
  const hWon = useMemo(() => parseAmount(hourly), [hourly]);
  const mWon = useMemo(() => parseAmount(monthly), [monthly]);

  const err = useMemo(() => {
    if (!Number.isFinite(hw) || hw <= 0 || hw > 168) return "주간 근로시간은 1~168시간 사이로 입력하세요.";
    return undefined;
  }, [hw]);

  const result = useMemo(() => {
    if (err) return null;
    if (mode === "toMonthly") {
      if (hWon === null || hWon <= 0) return null;
      return { kind: "m" as const, value: hourlyToMonthly(hWon, hw) };
    }
    if (mWon === null || mWon <= 0) return null;
    return { kind: "h" as const, value: monthlyToHourly(mWon, hw) };
  }, [mode, hWon, mWon, hw, err]);

  const copyText = useMemo(() => {
    if (!result?.value) return "";
    if (result.kind === "m") return `예상 월 금액: ${formatWon(result.value)}`;
    return `환산 시급: ${formatWon(result.value)}`;
  }, [result]);

  const handleReset = useCallback(() => {
    setMode("toMonthly");
    setHourly("");
    setMonthly("");
    setHoursWeek("40");
  }, []);

  const handleExample = useCallback(() => {
    setHourly("10030");
    setMonthly("2000000");
    setHoursWeek("40");
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("toMonthly")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "toMonthly"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              시급 → 월
            </button>
            <button
              type="button"
              onClick={() => setMode("toHourly")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "toHourly"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              월급 → 시급
            </button>
          </div>
          <FormField
            label="주간 근로시간 (시간)"
            value={hoursWeek}
            onChange={(e) => setHoursWeek(e.target.value)}
            inputMode="decimal"
            helperText="한 주 소정근로시간. 월 환산은 52주÷12개월을 사용합니다."
          />
          {mode === "toMonthly" ? (
            <FormField
              label="시급 (원)"
              value={hourly}
              onChange={(e) => setHourly(e.target.value)}
              inputMode="decimal"
            />
          ) : (
            <FormField
              label="월 금액 (원, 세전 등 본인 기준)"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              inputMode="decimal"
            />
          )}
          {err ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {err}
            </p>
          ) : null}
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        result?.value != null && !err ? (
          <ResultCard
            primaryLabel={mode === "toMonthly" ? "환산 월 금액(추정)" : "환산 시급(추정)"}
            primaryValue={formatWon(result.value)}
            copyText={copyText}
            description="실제 월 소정근로일수·수당·주휴와 다를 수 있습니다. 참고용입니다."
            extraRows={[{ label: "주간 시간", value: `${hw}시간` }]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            모드와 금액·주간 시간을 입력하면 환산 결과가 표시됩니다.
          </div>
        )
      }
    />
  );
}
