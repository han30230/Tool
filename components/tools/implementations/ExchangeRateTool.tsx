"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";

type RatesResponse = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

type CurrenciesResponse = Record<string, string>;

type ExchangeRateToolProps = { tool: ResolvedTool };

export function ExchangeRateTool({ tool }: ExchangeRateToolProps) {
  const [currencies, setCurrencies] = useState<CurrenciesResponse>({});
  const [from, setFrom] = useState("KRW");
  const [to, setTo] = useState("USD");
  const [amountRaw, setAmountRaw] = useState("100000");
  const [date, setDate] = useState<string>("");
  const [rate, setRate] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.frankfurter.app/currencies")
      .then((r) => r.json())
      .then((data: CurrenciesResponse) => {
        if (!cancelled && data && typeof data === "object") setCurrencies(data);
      })
      .catch(() => {
        if (!cancelled) setCurrencies({});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const currencyCodes = useMemo(() => Object.keys(currencies).sort(), [currencies]);

  const amount = useMemo(() => parseAmount(amountRaw), [amountRaw]);

  const fetchRate = useCallback(async () => {
    if (amount === null || amount < 0) {
      setError("금액을 확인해 주세요.");
      return;
    }
    if (from === to) {
      setRate(1);
      setResult(amount);
      setDate(new Date().toISOString().slice(0, 10));
      setError(undefined);
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("환율을 불러오지 못했습니다.");
      const data = (await res.json()) as RatesResponse;
      const r = data.rates[to];
      if (typeof r !== "number") throw new Error("선택한 통화 쌍을 지원하지 않습니다.");
      setRate(r);
      setResult(amount * r);
      setDate(data.date ?? "");
    } catch (e) {
      setRate(null);
      setResult(null);
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [amount, from, to]);

  const copyText = useMemo(() => {
    if (result === null || amount === null) return "";
    return [
      `${formatNumber(amount, 4)} ${from}`,
      `→ ${formatNumber(result, 4)} ${to}`,
      rate !== null ? `비율(참고): 1 ${from} = ${formatNumber(rate, 8)} ${to}` : "",
      date ? `기준일: ${date}` : "",
      "Frankfurter 공개 API(ECB 기준) 참고",
    ]
      .filter(Boolean)
      .join("\n");
  }, [amount, from, to, result, rate, date]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            환율은 Frankfurter 공개 API(ECB 시세 기반)를 사용합니다. 네트워크가 필요합니다.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="fx-from" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
                기준 통화
              </label>
              <select
                id="fx-from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
              >
                {currencyCodes.map((c) => (
                  <option key={c} value={c}>
                    {c} {currencies[c] ? `— ${currencies[c]}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="fx-to" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
                변환 통화
              </label>
              <select
                id="fx-to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
              >
                {currencyCodes.map((c) => (
                  <option key={c} value={c}>
                    {c} {currencies[c] ? `— ${currencies[c]}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <FormField
            label="금액"
            value={amountRaw}
            onChange={(e) => setAmountRaw(e.target.value)}
            inputMode="decimal"
            placeholder="예: 100000"
          />
          <button
            type="button"
            onClick={() => void fetchRate()}
            disabled={loading}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)] disabled:opacity-60"
          >
            {loading ? "불러오는 중…" : "환율 적용"}
          </button>
        </div>
      }
      resultSlot={
        error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-300" role="alert">
            {error}
          </div>
        ) : result !== null && amount !== null ? (
          <ResultCard
            primaryLabel={`${to} 환산(참고)`}
            primaryValue={formatNumber(result, 4)}
            copyText={copyText}
            description={
              date
                ? `기준일 ${date} · 1 ${from} = ${rate !== null ? formatNumber(rate, 8) : "?"} ${to}`
                : undefined
            }
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            금액과 통화를 고른 뒤 환율 적용을 누르세요.
          </div>
        )
      }
    />
  );
}
