"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import {
  parseTimeToMinutes,
  suggestBedtimesBeforeWake,
} from "@/lib/calculations/sleepCycle";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type SleepCycleToolProps = { tool: ResolvedTool };

export function SleepCycleTool({ tool }: SleepCycleToolProps) {
  const [wake, setWake] = useState("07:00");

  const wakeMin = useMemo(() => parseTimeToMinutes(wake), [wake]);

  const err = useMemo(() => {
    if (wake.trim() === "") return undefined;
    if (wakeMin === null) return "기상 시각을 HH:MM 형식으로 입력하세요. (예: 07:00)";
    return undefined;
  }, [wake, wakeMin]);

  const rows = useMemo(() => {
    if (wakeMin === null || err) return [];
    return suggestBedtimesBeforeWake(wakeMin, [4, 5, 6]);
  }, [wakeMin, err]);

  const copyText = useMemo(() => {
    if (rows.length === 0) return "";
    return rows.map((r) => `${r.cycles}사이클: ${r.bedTime} 취침 (약 ${r.sleepHoursApprox}시간 수면)`).join("\n");
  }, [rows]);

  const handleReset = useCallback(() => setWake(""), []);
  const handleExample = useCallback(() => setWake("07:00"), []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="기상 목표 시각"
            value={wake}
            onChange={(e) => setWake(e.target.value)}
            placeholder="07:00"
            type="time"
            helperText="24시간 형식. 90분 주기·잠들기 여유 약 14분 단순 모델입니다."
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
        rows.length > 0 && !err ? (
          <ResultCard
            primaryLabel="권장 취침 시각 (참고)"
            primaryValue={rows[1]?.bedTime ?? rows[0]?.bedTime ?? "—"}
            copyText={copyText}
            description="개인차·수면 질·수면 단계는 반영하지 않습니다. 의학적 조언이 아닙니다."
            extraRows={rows.map((r) => ({
              label: `${r.cycles}사이클 (약 ${r.sleepHoursApprox}h)`,
              value: r.bedTime,
            }))}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            기상 시각을 입력하면 4~6사이클 기준 취침 시각을 참고할 수 있습니다.
          </div>
        )
      }
    />
  );
}
