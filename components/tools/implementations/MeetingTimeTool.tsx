"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type MeetingTimeToolProps = { tool: ResolvedTool };

export function MeetingTimeTool({ tool }: MeetingTimeToolProps) {
  const [attendeesRaw, setAttendeesRaw] = useState("8");
  const [minutesRaw, setMinutesRaw] = useState("60");

  const attendees = useMemo(() => parseInt(attendeesRaw.replace(/\D/g, ""), 10), [attendeesRaw]);
  const minutes = useMemo(() => parseInt(minutesRaw.replace(/\D/g, ""), 10), [minutesRaw]);

  const err = useMemo(() => {
    if (!Number.isFinite(attendees) || attendees < 1) return "참석 인원을 확인하세요.";
    if (!Number.isFinite(minutes) || minutes < 1) return "회의 시간을 확인하세요.";
    return undefined;
  }, [attendees, minutes]);

  const result = useMemo(() => {
    if (err) return null;
    const personMinutes = attendees * minutes;
    const personHours = personMinutes / 60;
    return { personMinutes, personHours };
  }, [err, attendees, minutes]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="참석 인원(명)" value={attendeesRaw} onChange={(e) => setAttendeesRaw(e.target.value)} inputMode="numeric" />
          <FormField label="회의 시간(분)" value={minutesRaw} onChange={(e) => setMinutesRaw(e.target.value)} inputMode="numeric" />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar onReset={() => { setAttendeesRaw(""); setMinutesRaw(""); }} onExample={() => { setAttendeesRaw("8"); setMinutesRaw("60"); }} />
        </div>
      }
      resultSlot={
        result ? (
          <ResultCard
            primaryLabel="총 투입 시간"
            primaryValue={`${formatNumber(result.personHours, 2)} 인시`}
            copyText={`총 인분: ${result.personMinutes} 인분\n총 인시: ${formatNumber(result.personHours, 2)}h`}
            description="인시 = 참석 인원 × 회의 시간(시간)"
            extraRows={[{ label: "총 인분", value: `${formatNumber(result.personMinutes)} 분` }]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">값을 입력하세요.</div>
        )
      }
    />
  );
}

