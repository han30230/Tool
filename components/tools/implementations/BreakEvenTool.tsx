"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber, formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type BreakEvenToolProps = { tool: ResolvedTool };

export function BreakEvenTool({ tool }: BreakEvenToolProps) {
  const [fixedRaw, setFixedRaw] = useState("1000000");
  const [priceRaw, setPriceRaw] = useState("15000");
  const [variableRaw, setVariableRaw] = useState("7000");

  const fixed = useMemo(() => parseAmount(fixedRaw), [fixedRaw]);
  const price = useMemo(() => parseAmount(priceRaw), [priceRaw]);
  const variable = useMemo(() => parseAmount(variableRaw), [variableRaw]);

  const err = useMemo(() => {
    if (fixed === null || fixed < 0) return "고정비를 확인하세요.";
    if (price === null || price <= 0) return "판매 단가를 확인하세요.";
    if (variable === null || variable < 0) return "변동비를 확인하세요.";
    if (price <= variable) return "판매 단가는 변동비보다 커야 손익분기점을 계산할 수 있습니다.";
    return undefined;
  }, [fixed, price, variable]);

  const result = useMemo(() => {
    if (err || fixed === null || price === null || variable === null) return null;
    const unitMargin = price - variable;
    const bepQty = Math.ceil(fixed / unitMargin);
    const bepSales = bepQty * price;
    return { unitMargin, bepQty, bepSales };
  }, [err, fixed, price, variable]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="월 고정비(원)" value={fixedRaw} onChange={(e) => setFixedRaw(e.target.value)} inputMode="numeric" />
          <FormField label="판매 단가(개당, 원)" value={priceRaw} onChange={(e) => setPriceRaw(e.target.value)} inputMode="numeric" />
          <FormField label="변동비(개당, 원)" value={variableRaw} onChange={(e) => setVariableRaw(e.target.value)} inputMode="numeric" />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar onReset={() => { setFixedRaw(""); setPriceRaw(""); setVariableRaw(""); }} onExample={() => { setFixedRaw("1000000"); setPriceRaw("15000"); setVariableRaw("7000"); }} />
        </div>
      }
      resultSlot={
        result ? (
          <ResultCard
            primaryLabel="손익분기점 수량"
            primaryValue={`${formatNumber(result.bepQty)}개`}
            copyText={`손익분기점 수량: ${result.bepQty}개\n손익분기점 매출: ${formatWon(result.bepSales)}\n개당 공헌이익: ${formatWon(result.unitMargin)}`}
            description="BEP 수량 = 고정비 ÷ (판매단가 - 변동비)"
            extraRows={[
              { label: "손익분기점 매출", value: formatWon(result.bepSales) },
              { label: "개당 공헌이익", value: formatWon(result.unitMargin) },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">값을 입력하세요.</div>
        )
      }
    />
  );
}

