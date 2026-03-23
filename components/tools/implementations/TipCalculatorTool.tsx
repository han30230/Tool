"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type TipCalculatorToolProps = { tool: ResolvedTool };

export function TipCalculatorTool({ tool }: TipCalculatorToolProps) {
  const [bill, setBill] = useState("50000");
  const [tipPct, setTipPct] = useState("10");
  const [people, setPeople] = useState("2");

  const b = useMemo(() => parseAmount(bill), [bill]);
  const pct = useMemo(() => parseFloat(tipPct.replace(/,/g, "")), [tipPct]);
  const n = useMemo(() => parseInt(people.replace(/\D/g, ""), 10), [people]);

  const err = useMemo(() => {
    if (bill.trim() === "") return undefined;
    if (b === null || b < 0) return "금액을 입력하세요.";
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) return "팁 비율은 0~100%입니다.";
    if (!Number.isFinite(n) || n < 1 || n > 100) return "인원은 1~100명입니다.";
    return undefined;
  }, [bill, b, pct, n]);

  const result = useMemo(() => {
    if (b === null || err) return null;
    const tip = Math.round((b * pct) / 100);
    const total = b + tip;
    const each = Math.round(total / n);
    return { tip, total, each };
  }, [b, pct, n, err]);

  const copyText = useMemo(() => {
    if (!result) return "";
    return `팁: ${formatWon(result.tip)}\n총액: ${formatWon(result.total)}\n1인: 약 ${formatWon(result.each)}`;
  }, [result]);

  const handleReset = () => {
    setBill("");
    setTipPct("10");
    setPeople("2");
  };

  const handleExample = () => {
    setBill("50000");
    setTipPct("10");
    setPeople("2");
  };

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="계산 전 금액 (원)" value={bill} onChange={(e) => setBill(e.target.value)} inputMode="decimal" />
          <FormField label="팁 비율 (%)" value={tipPct} onChange={(e) => setTipPct(e.target.value)} inputMode="decimal" />
          <FormField label="함께 낼 인원" value={people} onChange={(e) => setPeople(e.target.value)} inputMode="numeric" />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        result ? (
          <ResultCard
            primaryLabel="팁 금액"
            primaryValue={formatWon(result.tip)}
            copyText={copyText}
            description="미국·해외 식사 문화 기준 참고입니다. 국내는 봉사료 포함 매장이 많습니다."
            extraRows={[
              { label: "총액(금액+팁)", value: formatWon(result.total) },
              { label: "1인 부담(균등)", value: formatWon(result.each) },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            금액과 팁 비율을 입력하세요.
          </div>
        )
      }
    />
  );
}
