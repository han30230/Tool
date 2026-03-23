"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { fromCostAndPrice, priceForTargetMarginPercent } from "@/lib/calculations/margin";
import { formatNumber, formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "cp" | "target";

type MarginToolProps = {
  tool: ResolvedTool;
};

export function MarginTool({ tool }: MarginToolProps) {
  const [mode, setMode] = useState<Mode>("cp");
  const [cost, setCost] = useState("70000");
  const [price, setPrice] = useState("100000");
  const [targetMargin, setTargetMargin] = useState("30");

  const err = (v: string) => {
    if (v.trim() === "") return undefined;
    const n = parseAmount(v);
    if (n === null) return "숫자만 입력할 수 있습니다.";
    return undefined;
  };

  const eCost = useMemo(() => err(cost), [cost]);
  const ePrice = useMemo(() => err(price), [price]);
  const eTm = useMemo(() => err(targetMargin), [targetMargin]);

  const pc = parseAmount(cost);
  const pp = parseAmount(price);
  const ptm = parseAmount(targetMargin);

  const resultCp = useMemo(() => {
    if (pc === null || pp === null || eCost || ePrice) return null;
    return fromCostAndPrice(pc, pp);
  }, [pc, pp, eCost, ePrice]);

  const resultTarget = useMemo(() => {
    if (pc === null || ptm === null || eCost || eTm) return null;
    if (ptm < 0 || ptm >= 100) return "range" as const;
    const p = priceForTargetMarginPercent(pc, ptm);
    if (p === null) return null;
    return { price: p, marginPct: ptm, cost: pc };
  }, [pc, ptm, eCost, eTm]);

  const copyCp = useMemo(() => {
    if (!resultCp) return "";
    return [
      `원가: ${formatWon(pc!)}`,
      `판매가: ${formatWon(pp!)}`,
      `마진액: ${formatWon(resultCp.marginAmount)}`,
      `마진율(판매가 대비): ${formatNumber(resultCp.marginPercentOnPrice)}%`,
      `마크업(원가 대비): ${formatNumber(resultCp.markupPercentOnCost)}%`,
    ].join("\n");
  }, [pc, pp, resultCp]);

  const copyT = useMemo(() => {
    if (!resultTarget || resultTarget === "range") return "";
    return [
      `원가: ${formatWon(resultTarget.cost)}`,
      `목표 마진율(판매가 대비): ${formatNumber(resultTarget.marginPct)}%`,
      `필요 판매가: ${formatWon(resultTarget.price)}`,
    ].join("\n");
  }, [resultTarget]);

  const handleReset = useCallback(() => {
    setMode("cp");
    setCost("");
    setPrice("");
    setTargetMargin("");
  }, []);

  const handleExample = useCallback(() => {
    if (mode === "cp") {
      setCost("70000");
      setPrice("100000");
    } else {
      setCost("70000");
      setTargetMargin("30");
    }
  }, [mode]);

  const usageSlot = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        사용 방법
      </summary>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
        <li>
          <strong className="text-[var(--foreground)]">원가·판매가</strong>: 마진액, 판매가 대비
          마진율, 원가 대비 마크업을 함께 봅니다.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">목표 마진율</strong>: 원가와 &quot;판매가
          대비&quot; 목표 마진율을 넣으면 필요한 판매가를 역산합니다.
        </li>
        <li>부가세·플랫폼 수수료는 포함하지 않은 단순 모델입니다. 실제 정산은 별도로 확인하세요.</li>
      </ul>
    </details>
  );

  const resultSlot = useMemo(() => {
    if (mode === "cp") {
      if (!resultCp) {
        if (pc !== null && pp !== null && pp <= 0) {
          return (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
              판매가는 0보다 커야 합니다.
            </div>
          );
        }
        return (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
            원가와 판매가를 입력하면 마진이 계산됩니다.
          </div>
        );
      }
      return (
        <ResultCard
          primaryLabel="마진액"
          primaryValue={formatWon(resultCp.marginAmount)}
          copyText={copyCp}
          description="판매가 대비 마진율과 원가 대비 마크업을 함께 확인하세요."
          extraRows={[
            { label: "마진율(판매가 대비)", value: `${formatNumber(resultCp.marginPercentOnPrice)}%` },
            { label: "마크업(원가 대비)", value: `${formatNumber(resultCp.markupPercentOnCost)}%` },
            { label: "원가", value: formatWon(pc!) },
            { label: "판매가", value: formatWon(pp!) },
          ]}
        />
      );
    }

    if (resultTarget === "range") {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
          목표 마진율은 0% 이상 100% 미만이어야 합니다.
        </div>
      );
    }
    if (!resultTarget) {
      return (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
          원가와 목표 마진율을 입력하면 필요한 판매가가 계산됩니다.
        </div>
      );
    }
    return (
      <ResultCard
        primaryLabel="필요 판매가"
        primaryValue={formatWon(resultTarget.price)}
        copyText={copyT}
        description={`원가 ${formatWon(resultTarget.cost)} · 목표 마진율 ${formatNumber(resultTarget.marginPct)}% (판매가 대비)`}
        extraRows={[{ label: "역산 판매가", value: formatWon(resultTarget.price) }]}
      />
    );
  }, [copyCp, copyT, mode, pc, pp, resultCp, resultTarget]);

  return (
    <ToolPageLayout
      tool={tool}
      usageSlot={usageSlot}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("cp")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "cp"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              원가·판매가
            </button>
            <button
              type="button"
              onClick={() => setMode("target")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "target"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              목표 마진율로 판매가
            </button>
          </div>

          {mode === "cp" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="원가 (원)"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                inputMode="decimal"
                error={eCost}
              />
              <FormField
                label="판매가 (원)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                error={ePrice}
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="원가 (원)"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                inputMode="decimal"
                error={eCost}
              />
              <FormField
                label="목표 마진율 — 판매가 대비 (%)"
                value={targetMargin}
                onChange={(e) => setTargetMargin(e.target.value)}
                inputMode="decimal"
                helperText="예: 30 → 판매가의 30%가 마진이 되도록 판매가를 맞춥니다."
                error={eTm}
              />
            </div>
          )}

          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={resultSlot}
    />
  );
}
