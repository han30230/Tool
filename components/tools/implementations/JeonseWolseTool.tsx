"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber, formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type JeonseWolseToolProps = { tool: ResolvedTool };

export function JeonseWolseTool({ tool }: JeonseWolseToolProps) {
  const [depositRaw, setDepositRaw] = useState("100000000");
  const [rentRaw, setRentRaw] = useState("500000");
  const [rateRaw, setRateRaw] = useState("4");
  const [mode, setMode] = useState<"to-rent" | "to-deposit">("to-rent");

  const deposit = useMemo(() => parseAmount(depositRaw), [depositRaw]);
  const rent = useMemo(() => parseAmount(rentRaw), [rentRaw]);
  const rate = useMemo(() => parseFloat(rateRaw.replace(",", ".")), [rateRaw]);

  const err = useMemo(() => {
    if (deposit === null || deposit < 0) return "보증금을 확인하세요.";
    if (rent === null || rent < 0) return "월세를 확인하세요.";
    if (!Number.isFinite(rate) || rate <= 0 || rate > 30) return "환산율(연 %)을 확인하세요.";
    return undefined;
  }, [deposit, rent, rate]);

  const result = useMemo(() => {
    if (err || deposit === null || rent === null) return null;
    if (mode === "to-rent") {
      const monthlyByDeposit = (deposit * (rate / 100)) / 12;
      return { label: "보증금의 월세 환산액", value: monthlyByDeposit };
    }
    const depositByRent = (rent * 12) / (rate / 100);
    return { label: "월세의 보증금 환산액", value: depositByRent };
  }, [err, deposit, rent, rate, mode]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setMode("to-rent")} className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${mode==="to-rent"?"bg-[var(--accent)] text-white":"border border-[var(--border)] bg-[var(--card)]"}`}>보증금 → 월세</button>
            <button type="button" onClick={() => setMode("to-deposit")} className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${mode==="to-deposit"?"bg-[var(--accent)] text-white":"border border-[var(--border)] bg-[var(--card)]"}`}>월세 → 보증금</button>
          </div>
          <FormField label="보증금(원)" value={depositRaw} onChange={(e) => setDepositRaw(e.target.value)} inputMode="numeric" />
          <FormField label="월세(원)" value={rentRaw} onChange={(e) => setRentRaw(e.target.value)} inputMode="numeric" />
          <FormField label="환산율(연 %)" value={rateRaw} onChange={(e) => setRateRaw(e.target.value)} inputMode="decimal" helperText="지역·계약 관행에 따라 달라질 수 있습니다." />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar onReset={() => { setDepositRaw(""); setRentRaw(""); setRateRaw("4"); }} onExample={() => { setDepositRaw("100000000"); setRentRaw("500000"); setRateRaw("4"); }} />
        </div>
      }
      resultSlot={
        result ? (
          <ResultCard
            primaryLabel={result.label}
            primaryValue={formatWon(result.value)}
            copyText={`${result.label}: ${formatWon(result.value)}\n환산율: ${formatNumber(rate,2)}%`}
            description="전월세 환산은 참고용이며 실제 계약 조건과 다를 수 있습니다."
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">값을 입력하세요.</div>
        )
      }
    />
  );
}

