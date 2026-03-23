"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber, formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type SalesFeeCalculatorToolProps = { tool: ResolvedTool };

export function SalesFeeCalculatorTool({ tool }: SalesFeeCalculatorToolProps) {
  const [priceRaw, setPriceRaw] = useState("39000");
  const [qtyRaw, setQtyRaw] = useState("10");
  const [feePctRaw, setFeePctRaw] = useState("10");
  const [fixedFeeRaw, setFixedFeeRaw] = useState("0");

  const price = useMemo(() => parseAmount(priceRaw), [priceRaw]);
  const qty = useMemo(() => parseInt(qtyRaw.replace(/\D/g, ""), 10), [qtyRaw]);
  const feePct = useMemo(() => parseFloat(feePctRaw.replace(",", ".")), [feePctRaw]);
  const fixedFee = useMemo(() => parseAmount(fixedFeeRaw), [fixedFeeRaw]);

  const err = useMemo(() => {
    if (price === null || price < 0) return "판매가를 확인하세요.";
    if (!Number.isFinite(qty) || qty < 1) return "수량은 1 이상이어야 합니다.";
    if (!Number.isFinite(feePct) || feePct < 0 || feePct > 100) return "수수료율은 0~100%입니다.";
    if (fixedFee === null || fixedFee < 0) return "건당 고정 수수료를 확인하세요.";
    return undefined;
  }, [price, qty, feePct, fixedFee]);

  const result = useMemo(() => {
    if (err || price === null || fixedFee === null) return null;
    const gross = price * qty;
    const fee = gross * (feePct / 100) + fixedFee * qty;
    const net = gross - fee;
    const netPerUnit = net / qty;
    return { gross, fee, net, netPerUnit };
  }, [err, price, qty, feePct, fixedFee]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="판매가(1개, 원)" value={priceRaw} onChange={(e) => setPriceRaw(e.target.value)} inputMode="numeric" />
          <FormField label="수량" value={qtyRaw} onChange={(e) => setQtyRaw(e.target.value)} inputMode="numeric" />
          <FormField label="수수료율(%)" value={feePctRaw} onChange={(e) => setFeePctRaw(e.target.value)} inputMode="decimal" />
          <FormField label="건당 고정 수수료(원)" value={fixedFeeRaw} onChange={(e) => setFixedFeeRaw(e.target.value)} inputMode="numeric" />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar onReset={() => { setPriceRaw(""); setQtyRaw(""); setFeePctRaw("10"); setFixedFeeRaw("0"); }} onExample={() => { setPriceRaw("39000"); setQtyRaw("10"); setFeePctRaw("10"); setFixedFeeRaw("300"); }} />
        </div>
      }
      resultSlot={
        result ? (
          <ResultCard
            primaryLabel="정산 예상금액"
            primaryValue={formatWon(result.net)}
            copyText={`총매출: ${formatWon(result.gross)}\n총수수료: ${formatWon(result.fee)}\n정산예상: ${formatWon(result.net)}\n개당 정산: ${formatWon(result.netPerUnit)}`}
            description="수수료율+건당 고정 수수료 단순 모델입니다."
            extraRows={[
              { label: "총매출", value: formatWon(result.gross) },
              { label: "총수수료", value: formatWon(result.fee) },
              { label: "개당 정산", value: `${formatWon(result.netPerUnit)} (${formatNumber(result.netPerUnit, 2)})` },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">값을 입력하면 정산 예상금액이 표시됩니다.</div>
        )
      }
    />
  );
}

