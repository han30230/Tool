"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber, formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type UnitCostWithShippingToolProps = { tool: ResolvedTool };

export function UnitCostWithShippingTool({ tool }: UnitCostWithShippingToolProps) {
  const [productCostRaw, setProductCostRaw] = useState("100000");
  const [shippingRaw, setShippingRaw] = useState("10000");
  const [qtyRaw, setQtyRaw] = useState("20");

  const productCost = useMemo(() => parseAmount(productCostRaw), [productCostRaw]);
  const shipping = useMemo(() => parseAmount(shippingRaw), [shippingRaw]);
  const qty = useMemo(() => parseInt(qtyRaw.replace(/\D/g, ""), 10), [qtyRaw]);

  const err = useMemo(() => {
    if (productCost === null || productCost < 0) return "상품 원가를 확인하세요.";
    if (shipping === null || shipping < 0) return "배송비를 확인하세요.";
    if (!Number.isFinite(qty) || qty < 1) return "수량은 1 이상이어야 합니다.";
    return undefined;
  }, [productCost, shipping, qty]);

  const result = useMemo(() => {
    if (err || productCost === null || shipping === null) return null;
    const total = productCost + shipping;
    const perUnit = total / qty;
    return { total, perUnit };
  }, [err, productCost, shipping, qty]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="상품 총 원가(원)" value={productCostRaw} onChange={(e) => setProductCostRaw(e.target.value)} inputMode="numeric" />
          <FormField label="총 배송비(원)" value={shippingRaw} onChange={(e) => setShippingRaw(e.target.value)} inputMode="numeric" />
          <FormField label="수량(개)" value={qtyRaw} onChange={(e) => setQtyRaw(e.target.value)} inputMode="numeric" />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar onReset={() => { setProductCostRaw(""); setShippingRaw(""); setQtyRaw(""); }} onExample={() => { setProductCostRaw("100000"); setShippingRaw("10000"); setQtyRaw("20"); }} />
        </div>
      }
      resultSlot={
        result ? (
          <ResultCard
            primaryLabel="배송비 포함 개당 원가"
            primaryValue={formatWon(result.perUnit)}
            copyText={`총원가: ${formatWon(result.total)}\n개당원가: ${formatWon(result.perUnit)} (${formatNumber(result.perUnit, 2)})`}
            description="총원가 = 상품원가 + 배송비, 개당원가 = 총원가 ÷ 수량"
            extraRows={[{ label: "총 원가", value: formatWon(result.total) }]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">값을 입력하세요.</div>
        )
      }
    />
  );
}

