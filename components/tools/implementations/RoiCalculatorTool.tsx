"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber, formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type RoiCalculatorToolProps = { tool: ResolvedTool };

export function RoiCalculatorTool({ tool }: RoiCalculatorToolProps) {
  const [cost, setCost] = useState("1000000");
  const [revenue, setRevenue] = useState("1300000");
  const c = useMemo(() => parseAmount(cost), [cost]);
  const r = useMemo(() => parseAmount(revenue), [revenue]);

  const err = useMemo(() => {
    if (c === null || r === null) return "투입비용과 회수금액을 입력하세요.";
    if (c <= 0) return "투입비용은 0보다 커야 합니다.";
    return undefined;
  }, [c, r]);

  const result = useMemo(() => {
    if (!c || r === null) return null;
    const profit = r - c;
    const roi = (profit / c) * 100;
    return { profit, roi };
  }, [c, r]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="투입비용 (원)" value={cost} onChange={(e) => setCost(e.target.value)} inputMode="numeric" />
          <FormField label="회수금액/매출 (원)" value={revenue} onChange={(e) => setRevenue(e.target.value)} inputMode="numeric" />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar onReset={() => { setCost(""); setRevenue(""); }} onExample={() => { setCost("1000000"); setRevenue("1300000"); }} />
        </div>
      }
      resultSlot={
        result && !err ? (
          <ResultCard
            primaryLabel="ROI"
            primaryValue={`${formatNumber(result.roi, 2)}%`}
            copyText={`ROI: ${formatNumber(result.roi, 2)}%\n순이익: ${formatWon(result.profit)}`}
            description="ROI = (순이익 ÷ 투입비용) × 100"
            extraRows={[{ label: "순이익", value: formatWon(result.profit) }]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">값을 입력하세요.</div>
        )
      }
    />
  );
}

