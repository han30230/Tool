"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber } from "@/lib/format/ko";
import { paceMinPerKm, formatMinPerKm } from "@/lib/calculations/pace";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type PaceCalculatorToolProps = { tool: ResolvedTool };

export function PaceCalculatorTool({ tool }: PaceCalculatorToolProps) {
  const [km, setKm] = useState("5");
  const [min, setMin] = useState("28");
  const [sec, setSec] = useState("30");

  const d = useMemo(() => parseFloat(km.replace(/,/g, "")), [km]);
  const m = useMemo(() => parseInt(min.replace(/\D/g, ""), 10), [min]);
  const s = useMemo(() => parseInt(sec.replace(/\D/g, ""), 10), [sec]);

  const err = useMemo(() => {
    if (km.trim() === "") return undefined;
    if (!Number.isFinite(d) || d <= 0 || d > 1000) return "거리(km)를 확인하세요.";
    const totalSec = (Number.isFinite(m) ? m : 0) * 60 + (Number.isFinite(s) ? s : 0);
    if (totalSec <= 0) return "시간을 입력하세요.";
    return undefined;
  }, [km, d, m, s]);

  const result = useMemo(() => {
    if (err) return null;
    const totalSec = (Number.isFinite(m) ? m : 0) * 60 + (Number.isFinite(s) ? Math.min(59, Math.max(0, s)) : 0);
    const pace = paceMinPerKm(totalSec, d);
    if (pace === null) return null;
    const kmh = (d / totalSec) * 3600;
    return { pace, kmh };
  }, [d, m, s, err]);

  const copyText = useMemo(() => {
    if (!result) return "";
    return `페이스: ${formatMinPerKm(result.pace)}, 평균 시속: ${formatNumber(result.kmh, 2)} km/h`;
  }, [result]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="거리 (km)" value={km} onChange={(e) => setKm(e.target.value)} inputMode="decimal" />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="시간 (분)" value={min} onChange={(e) => setMin(e.target.value)} inputMode="numeric" />
            <FormField label="시간 (초)" value={sec} onChange={(e) => setSec(e.target.value)} inputMode="numeric" />
          </div>
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar
            onReset={() => {
              setKm("");
              setMin("");
              setSec("");
            }}
            onExample={() => {
              setKm("5");
              setMin("28");
              setSec("30");
            }}
          />
        </div>
      }
      resultSlot={
        result ? (
          <ResultCard
            primaryLabel="페이스 (분/km)"
            primaryValue={formatMinPerKm(result.pace)}
            copyText={copyText}
            description="GPS·트랙과 약간 다를 수 있습니다."
            extraRows={[{ label: "평균 속도", value: `${formatNumber(result.kmh, 2)} km/h` }]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            거리와 기록 시간을 입력하세요.
          </div>
        )
      }
    />
  );
}
