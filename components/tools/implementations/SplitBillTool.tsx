"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type SplitBillToolProps = { tool: ResolvedTool };

export function SplitBillTool({ tool }: SplitBillToolProps) {
  const [total, setTotal] = useState("120000");
  const [people, setPeople] = useState("4");

  const t = useMemo(() => parseAmount(total), [total]);
  const n = useMemo(() => parseInt(people.replace(/\D/g, ""), 10), [people]);

  const err = useMemo(() => {
    if (total.trim() === "") return undefined;
    if (t === null || t <= 0) return "총액을 입력하세요.";
    if (!Number.isFinite(n) || n < 1 || n > 100) return "인원은 1~100명입니다.";
    return undefined;
  }, [total, t, n]);

  const result = useMemo(() => {
    if (t === null || err) return null;
    const base = Math.floor(t / n);
    const remainder = t - base * n;
    return { base, remainder, n };
  }, [t, n, err]);

  const copyText = useMemo(() => {
    if (!result) return "";
    return `1인: ${formatWon(result.base)}${result.remainder > 0 ? `, 나머지 ${result.remainder}원 조정` : ""}`;
  }, [result]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="총 결제 금액 (원)" value={total} onChange={(e) => setTotal(e.target.value)} inputMode="decimal" />
          <FormField label="N명" value={people} onChange={(e) => setPeople(e.target.value)} inputMode="numeric" />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar
            onReset={() => {
              setTotal("");
              setPeople("2");
            }}
            onExample={() => {
              setTotal("120000");
              setPeople("4");
            }}
          />
        </div>
      }
      resultSlot={
        result ? (
          <ResultCard
            primaryLabel="1인 기본 부담"
            primaryValue={formatWon(result.base)}
            copyText={copyText}
            description={
              result.remainder > 0
                ? `원 단위로 나누면 ${result.remainder}원이 남습니다. 한 명이 더 내거나 카드·현금으로 조정하세요.`
                : "딱 나누어 떨어집니다."
            }
            extraRows={[{ label: "인원", value: `${result.n}명` }]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            총액과 인원을 입력하세요.
          </div>
        )
      }
    />
  );
}
