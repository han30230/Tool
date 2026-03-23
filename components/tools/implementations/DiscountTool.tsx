"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { fromOriginalAndRate, fromOriginalAndSale } from "@/lib/calculations/discount";
import { formatNumber, formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "prices" | "rate";

type DiscountToolProps = {
  tool: ResolvedTool;
};

export function DiscountTool({ tool }: DiscountToolProps) {
  const [mode, setMode] = useState<Mode>("prices");
  const [original, setOriginal] = useState("100000");
  const [sale, setSale] = useState("85000");
  const [rate, setRate] = useState("15");

  const err = (v: string) => {
    if (v.trim() === "") return undefined;
    const n = parseAmount(v);
    if (n === null) return "숫자만 입력할 수 있습니다.";
    return undefined;
  };

  const eOrig = useMemo(() => err(original), [original]);
  const eSale = useMemo(() => err(sale), [sale]);
  const eRate = useMemo(() => err(rate), [rate]);

  const po = parseAmount(original);
  const ps = parseAmount(sale);
  const pr = parseAmount(rate);

  const result = useMemo(() => {
    if (mode === "prices") {
      if (po === null || ps === null || eOrig || eSale) return null;
      if (po <= 0) return "bad" as const;
      if (ps < 0 || ps > po) return "range" as const;
      return fromOriginalAndSale(po, ps);
    }
    if (po === null || pr === null || eOrig || eRate) return null;
    if (po <= 0) return "bad" as const;
    if (pr < 0 || pr > 100) return "rate" as const;
    return fromOriginalAndRate(po, pr);
  }, [mode, po, ps, pr, eOrig, eSale, eRate]);

  const copyText = useMemo(() => {
    if (!result || result === "bad" || result === "range" || result === "rate") return "";
    if (mode === "prices") {
      return [
        `정가: ${formatWon(po!)}`,
        `할인가: ${formatWon(ps!)}`,
        `할인율: ${formatNumber(result.discountPercent)}%`,
        `절약 금액: ${formatWon(result.savings)}`,
      ].join("\n");
    }
    return [
      `정가: ${formatWon(po!)}`,
      `할인율: ${formatNumber(result.discountPercent)}%`,
      `최종 가격: ${formatWon(result.finalPrice)}`,
      `절약 금액: ${formatWon(result.savings)}`,
    ].join("\n");
  }, [mode, po, ps, result]);

  const handleReset = useCallback(() => {
    setMode("prices");
    setOriginal("");
    setSale("");
    setRate("");
  }, []);

  const handleExample = useCallback(() => {
    if (mode === "prices") {
      setOriginal("100000");
      setSale("85000");
    } else {
      setOriginal("100000");
      setRate("15");
    }
  }, [mode]);

  const usageSlot = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        사용 방법
      </summary>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
        <li>
          <strong className="text-[var(--foreground)]">정가·할인가</strong>를 알 때: 할인율과 절약
          금액을 구합니다.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">정가·할인율</strong>을 알 때: 최종 가격과 절약
          금액을 구합니다.
        </li>
        <li>할인가가 정가보다 크면 계산할 수 없습니다.</li>
      </ul>
    </details>
  );

  const resultView = useMemo(() => {
    if (result === null) {
      return (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
          값을 입력하면 할인율·금액이 여기에 표시됩니다.
        </div>
      );
    }
    if (result === "bad") {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
          정가는 0보다 커야 합니다.
        </div>
      );
    }
    if (result === "range") {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
          할인가는 0 이상, 정가 이하여야 합니다.
        </div>
      );
    }
    if (result === "rate") {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
          할인율은 0% 이상 100% 이하여야 합니다.
        </div>
      );
    }
    if (mode === "prices") {
      return (
        <ResultCard
          primaryLabel="할인율"
          primaryValue={`${formatNumber(result.discountPercent)}%`}
          copyText={copyText}
          description={`절약 금액 ${formatWon(result.savings)} · 최종 ${formatWon(result.finalPrice)}`}
          extraRows={[
            { label: "정가", value: formatWon(po!) },
            { label: "할인가", value: formatWon(ps!) },
            { label: "절약 금액", value: formatWon(result.savings) },
          ]}
        />
      );
    }
    return (
      <ResultCard
        primaryLabel="최종 가격"
        primaryValue={formatWon(result.finalPrice)}
        copyText={copyText}
        description={`할인율 ${formatNumber(result.discountPercent)}% · 절약 ${formatWon(result.savings)}`}
        extraRows={[
          { label: "정가", value: formatWon(po!) },
          { label: "할인율", value: `${formatNumber(result.discountPercent)}%` },
          { label: "절약 금액", value: formatWon(result.savings) },
        ]}
      />
    );
  }, [copyText, mode, po, ps, result]);

  return (
    <ToolPageLayout
      tool={tool}
      usageSlot={usageSlot}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("prices")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "prices"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              정가·할인가
            </button>
            <button
              type="button"
              onClick={() => setMode("rate")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "rate"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              정가·할인율
            </button>
          </div>

          {mode === "prices" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="정가 (원)"
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                inputMode="decimal"
                error={eOrig}
              />
              <FormField
                label="할인가 (원)"
                value={sale}
                onChange={(e) => setSale(e.target.value)}
                inputMode="decimal"
                error={eSale}
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="정가 (원)"
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                inputMode="decimal"
                error={eOrig}
              />
              <FormField
                label="할인율 (%)"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                inputMode="decimal"
                error={eRate}
              />
            </div>
          )}

          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={resultView}
    />
  );
}
