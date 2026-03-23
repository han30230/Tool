"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type ModelCostEstimatorToolProps = { tool: ResolvedTool };

type ModelPreset = {
  id: string;
  label: string;
  inPrice: number;
  outPrice: number;
  contextLimit?: number;
  outputLimit?: number;
};

const PRESETS: ModelPreset[] = [
  { id: "custom", label: "직접 입력", inPrice: 0, outPrice: 0 },
  {
    id: "gpt-4.1-mini-like",
    label: "경량 모델 예시 (1M당 $0.8 / $3.2)",
    inPrice: 0.8,
    outPrice: 3.2,
    contextLimit: 128000,
    outputLimit: 16000,
  },
  {
    id: "gpt-4.1-like",
    label: "고성능 모델 예시 (1M당 $3 / $15)",
    inPrice: 3,
    outPrice: 15,
    contextLimit: 128000,
    outputLimit: 32000,
  },
  {
    id: "gemini-flash-like",
    label: "초고속 모델 예시 (1M당 $0.35 / $1.05)",
    inPrice: 0.35,
    outPrice: 1.05,
    contextLimit: 1000000,
    outputLimit: 8192,
  },
];

const COMPARE_PRESETS = PRESETS.filter((p) => p.id !== "custom");

function cost(tokens: number, pricePer1M: number): number {
  return (tokens / 1_000_000) * pricePer1M;
}

export function ModelCostEstimatorTool({ tool }: ModelCostEstimatorToolProps) {
  const [inputTokensRaw, setInputTokensRaw] = useState("120000");
  const [outputTokensRaw, setOutputTokensRaw] = useState("30000");
  const [inPriceRaw, setInPriceRaw] = useState("3");
  const [outPriceRaw, setOutPriceRaw] = useState("15");
  const [fxRaw, setFxRaw] = useState("1380");
  const [preset, setPreset] = useState("gpt-4.1-like");

  const inputTokens = useMemo(() => parseAmount(inputTokensRaw), [inputTokensRaw]);
  const outputTokens = useMemo(() => parseAmount(outputTokensRaw), [outputTokensRaw]);
  const inPrice = useMemo(() => parseAmount(inPriceRaw), [inPriceRaw]);
  const outPrice = useMemo(() => parseAmount(outPriceRaw), [outPriceRaw]);
  const fx = useMemo(() => parseAmount(fxRaw), [fxRaw]);

  const err = useMemo(() => {
    if (inputTokens === null || outputTokens === null) return "토큰 수를 확인하세요.";
    if (inPrice === null || outPrice === null) return "단가를 확인하세요.";
    if (fx === null || fx <= 0) return "환율(원/USD)을 확인하세요.";
    if (inputTokens < 0 || outputTokens < 0 || inPrice < 0 || outPrice < 0) return "음수 값은 사용할 수 없습니다.";
    return undefined;
  }, [inputTokens, outputTokens, inPrice, outPrice, fx]);

  const result = useMemo(() => {
    if (err || inputTokens === null || outputTokens === null || inPrice === null || outPrice === null || fx === null) return null;
    const inCost = cost(inputTokens, inPrice);
    const outCost = cost(outputTokens, outPrice);
    const total = inCost + outCost;
    const totalKrw = total * fx;
    return { inCost, outCost, total, totalKrw };
  }, [err, inputTokens, outputTokens, inPrice, outPrice, fx]);

  const compareRows = useMemo(() => {
    if (inputTokens === null || outputTokens === null || fx === null) return [];
    return COMPARE_PRESETS.map((p) => {
      const inCost = cost(inputTokens, p.inPrice);
      const outCost = cost(outputTokens, p.outPrice);
      const total = inCost + outCost;
      return {
        label: p.label,
        inCost,
        outCost,
        total,
        totalKrw: total * fx,
      };
    }).sort((a, b) => a.total - b.total);
  }, [inputTokens, outputTokens, fx]);

  const activePreset = useMemo(
    () => PRESETS.find((p) => p.id === preset),
    [preset],
  );
  const modelWarnings = useMemo(() => {
    if (!activePreset || activePreset.id === "custom") return [] as string[];
    if (inputTokens === null || outputTokens === null) return [] as string[];
    const warnings: string[] = [];
    const total = inputTokens + outputTokens;
    if (activePreset.contextLimit && total > activePreset.contextLimit) {
      warnings.push(
        `입력+출력 토큰(${formatNumber(total, 0)})이 컨텍스트 한도(${formatNumber(activePreset.contextLimit, 0)})를 초과합니다.`,
      );
    } else if (
      activePreset.contextLimit &&
      total > activePreset.contextLimit * 0.9
    ) {
      warnings.push(
        `입력+출력 토큰이 컨텍스트 한도의 90%를 넘었습니다 (${formatNumber(total, 0)} / ${formatNumber(activePreset.contextLimit, 0)}).`,
      );
    }
    if (activePreset.outputLimit && outputTokens > activePreset.outputLimit) {
      warnings.push(
        `출력 토큰(${formatNumber(outputTokens, 0)})이 출력 한도(${formatNumber(activePreset.outputLimit, 0)})를 초과합니다.`,
      );
    } else if (
      activePreset.outputLimit &&
      outputTokens > activePreset.outputLimit * 0.9
    ) {
      warnings.push(
        `출력 토큰이 출력 한도의 90%를 넘었습니다 (${formatNumber(outputTokens, 0)} / ${formatNumber(activePreset.outputLimit, 0)}).`,
      );
    }
    return warnings;
  }, [activePreset, inputTokens, outputTokens]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[var(--foreground)]">
            모델 단가 프리셋
            <select
              value={preset}
              onChange={(e) => {
                const next = e.target.value;
                setPreset(next);
                const hit = PRESETS.find((p) => p.id === next);
                if (!hit || hit.id === "custom") return;
                setInPriceRaw(String(hit.inPrice));
                setOutPriceRaw(String(hit.outPrice));
              }}
              className="mt-2 w-full min-h-[44px] rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2"
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <FormField label="입력 토큰 수" value={inputTokensRaw} onChange={(e) => setInputTokensRaw(e.target.value)} inputMode="numeric" />
          <FormField label="출력 토큰 수" value={outputTokensRaw} onChange={(e) => setOutputTokensRaw(e.target.value)} inputMode="numeric" />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="입력 단가 (USD / 1M tokens)" value={inPriceRaw} onChange={(e) => setInPriceRaw(e.target.value)} inputMode="decimal" />
            <FormField label="출력 단가 (USD / 1M tokens)" value={outPriceRaw} onChange={(e) => setOutPriceRaw(e.target.value)} inputMode="decimal" />
          </div>
          <FormField label="환율 (원 / USD)" value={fxRaw} onChange={(e) => setFxRaw(e.target.value)} inputMode="decimal" />
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <ToolActionBar onReset={() => { setInputTokensRaw(""); setOutputTokensRaw(""); setFxRaw("1380"); }} onExample={() => { setInputTokensRaw("120000"); setOutputTokensRaw("30000"); setInPriceRaw("3"); setOutPriceRaw("15"); setFxRaw("1380"); }} />
          {activePreset && activePreset.id !== "custom" ? (
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-inner)] px-3 py-1 text-[var(--muted)]">
                컨텍스트 한도 {formatNumber(activePreset.contextLimit ?? 0, 0)} tokens
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-inner)] px-3 py-1 text-[var(--muted)]">
                출력 한도 {formatNumber(activePreset.outputLimit ?? 0, 0)} tokens
              </span>
            </div>
          ) : null}
          {modelWarnings.length > 0 ? (
            <ul className="space-y-2">
              {modelWarnings.map((msg) => (
                <li key={msg} className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
                  {msg}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      }
      resultSlot={
        result ? (
          <div className="space-y-4">
            <ResultCard
              primaryLabel="예상 총 비용 (USD)"
              primaryValue={`$${formatNumber(result.total, 6)}`}
              copyText={`입력 비용: $${result.inCost.toFixed(6)}\n출력 비용: $${result.outCost.toFixed(6)}\n총 비용: $${result.total.toFixed(6)}\n총 비용(원): ${Math.round(result.totalKrw)}원`}
              description="공식 가격표 기준 참고 계산입니다. 최소 청구 단위·환율·세금은 별도입니다."
              extraRows={[
                { label: "입력 비용", value: `$${formatNumber(result.inCost, 6)}` },
                { label: "출력 비용", value: `$${formatNumber(result.outCost, 6)}` },
                { label: "총 비용(원)", value: `${formatNumber(result.totalKrw, 0)}원` },
              ]}
            />
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                프리셋 비용 비교
              </p>
              <div className="mt-3 overflow-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="text-left text-[var(--muted)]">
                    <tr>
                      <th className="pb-2 font-medium">모델</th>
                      <th className="pb-2 font-medium">입력 비용</th>
                      <th className="pb-2 font-medium">출력 비용</th>
                      <th className="pb-2 font-medium">총 비용(USD)</th>
                      <th className="pb-2 font-medium">총 비용(원)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map((row) => (
                      <tr key={row.label} className="border-t border-[var(--border)]">
                        <td className="py-2 pr-3">{row.label}</td>
                        <td className="py-2 pr-3">${formatNumber(row.inCost, 6)}</td>
                        <td className="py-2 pr-3">${formatNumber(row.outCost, 6)}</td>
                        <td className="py-2 pr-3 font-semibold">${formatNumber(row.total, 6)}</td>
                        <td className="py-2">{formatNumber(row.totalKrw, 0)}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">값을 입력하세요.</div>
        )
      }
    />
  );
}

