"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type SpeedConverterToolProps = { tool: ResolvedTool };

export function SpeedConverterTool({ tool }: SpeedConverterToolProps) {
  const [kmh, setKmh] = useState("100");

  const k = useMemo(() => parseFloat(kmh.replace(/,/g, "")), [kmh]);

  const result = useMemo(() => {
    if (!Number.isFinite(k) || k < 0 || k > 1e6) return null;
    const mph = k * 0.621371;
    const ms = k / 3.6;
    const knot = k / 1.852;
    return { mph, ms, knot };
  }, [k]);

  const err = useMemo(() => {
    if (kmh.trim() === "") return undefined;
    if (!Number.isFinite(k) || k < 0) return "0 이상의 숫자를 입력하세요.";
    return undefined;
  }, [kmh, k]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="속도 (km/h)" value={kmh} onChange={(e) => setKmh(e.target.value)} inputMode="decimal" />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar onReset={() => setKmh("")} onExample={() => setKmh("100")} />
        </div>
      }
      resultSlot={
        result && !err ? (
          <ResultCard
            primaryLabel="mph"
            primaryValue={formatNumber(result.mph, 2)}
            copyText={`${formatNumber(k, 2)} km/h = ${formatNumber(result.mph, 2)} mph`}
            description="단위 변환 참고값입니다."
            extraRows={[
              { label: "m/s", value: formatNumber(result.ms, 2) },
              { label: "노트(해리/시)", value: formatNumber(result.knot, 2) },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            km/h를 입력하세요.
          </div>
        )
      }
    />
  );
}
