"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

/** 체중 1kg당 약 30~35ml 중 33ml 단순 모델 */
function mlPerDay(weightKg: number): number {
  return Math.round(weightKg * 33);
}

type WaterIntakeToolProps = { tool: ResolvedTool };

export function WaterIntakeTool({ tool }: WaterIntakeToolProps) {
  const [kg, setKg] = useState("65");

  const w = useMemo(() => parseFloat(kg.replace(/,/g, "")), [kg]);

  const err = useMemo(() => {
    if (kg.trim() === "") return undefined;
    if (!Number.isFinite(w) || w <= 0 || w > 300) return "체중은 1~300kg 사이로 입력하세요.";
    return undefined;
  }, [kg, w]);

  const ml = useMemo(() => (err || !Number.isFinite(w) ? null : mlPerDay(w)), [w, err]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="체중 (kg)" value={kg} onChange={(e) => setKg(e.target.value)} inputMode="decimal" />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <p className="text-xs text-[var(--muted)]">체중×33ml/일 정도의 참고값입니다. 활동량·날씨·건강 상태는 반영하지 않습니다.</p>
          <ToolActionBar onReset={() => setKg("")} onExample={() => setKg("65")} />
        </div>
      }
      resultSlot={
        ml != null ? (
          <ResultCard
            primaryLabel="참고 하루 수분 (ml)"
            primaryValue={formatNumber(ml, 0)}
            copyText={`약 ${ml} ml/일`}
            description="의학적 권장량이 아닙니다. 임신·질환이 있으면 전문가와 상담하세요."
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            체중을 입력하세요.
          </div>
        )
      }
    />
  );
}
