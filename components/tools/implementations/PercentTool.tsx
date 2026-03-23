"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import {
  decreaseByPercent,
  increaseByPercent,
  percentChange,
  percentOf,
} from "@/lib/calculations/percent";
import { formatNumber, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "of" | "inc" | "dec" | "chg";

type PercentToolProps = {
  tool: ResolvedTool;
};

function fieldErr(raw: string): string | undefined {
  if (raw.trim() === "") return undefined;
  const n = parseAmount(raw);
  if (n === null) return "숫자만 입력할 수 있습니다.";
  return undefined;
}

export function PercentTool({ tool }: PercentToolProps) {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("10000");
  const [b, setB] = useState("10");
  const [from, setFrom] = useState("80");
  const [to, setTo] = useState("100");

  const errA = useMemo(() => fieldErr(a), [a]);
  const errB = useMemo(() => fieldErr(b), [b]);
  const errFrom = useMemo(() => fieldErr(from), [from]);
  const errTo = useMemo(() => fieldErr(to), [to]);

  const pa = parseAmount(a);
  const pb = parseAmount(b);
  const pfrom = parseAmount(from);
  const pto = parseAmount(to);

  const result = useMemo(() => {
    if (mode === "of" || mode === "inc" || mode === "dec") {
      if (pa === null || pb === null || errA || errB) return null;
      if (mode === "of") return percentOf(pa, pb);
      if (mode === "inc") return increaseByPercent(pa, pb);
      return decreaseByPercent(pa, pb);
    }
    if (pfrom === null || pto === null || errFrom || errTo) return null;
    return percentChange(pfrom, pto);
  }, [mode, pa, pb, pfrom, pto, errA, errB, errFrom, errTo]);

  const primary = useMemo(() => {
    if (result === null) return { label: "결과", value: "", copy: "" };
    if (mode === "chg") {
      const v = formatNumber(result);
      return {
        label: "변화율",
        value: `${v}%`,
        copy: `변화율: ${v}%`,
      };
    }
    const v = formatNumber(result);
    return {
      label: mode === "of" ? "계산 결과" : mode === "inc" ? "증가 후 값" : "감소 후 값",
      value: v,
      copy: `${mode === "of" ? "값" : "결과"}: ${v}`,
    };
  }, [mode, result]);

  const handleReset = useCallback(() => {
    setMode("of");
    setA("");
    setB("");
    setFrom("");
    setTo("");
  }, []);

  const handleExample = useCallback(() => {
    if (mode === "chg") {
      setFrom("80");
      setTo("100");
    } else {
      setA("10000");
      setB("10");
    }
  }, [mode]);

  const usageSlot = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        사용 방법
      </summary>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
        <li>
          <strong className="text-[var(--foreground)]">A의 B%</strong>: 전체 값의 일정 비율을 구할 때
          사용합니다.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">증가·감소</strong>: 기준 값에 몇 %를 더하거나 뺀
          결과를 구합니다.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">변화율</strong>: 이전 값과 이후 값이 있을 때
          증감률(%)을 구합니다. 이전 값이 0이면 계산할 수 없습니다.
        </li>
      </ul>
    </details>
  );

  const hasErr = mode === "chg" ? errFrom || errTo : errA || errB;
  const changeFromZero =
    mode === "chg" &&
    pfrom === 0 &&
    pto !== null &&
    !errFrom &&
    !errTo;

  return (
    <ToolPageLayout
      tool={tool}
      usageSlot={usageSlot}
      inputSlot={
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["of", "A의 B%"],
                ["inc", "A에서 B% 증가"],
                ["dec", "A에서 B% 감소"],
                ["chg", "변화율"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-medium ${
                  mode === id
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "chg" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="이전 값"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                inputMode="decimal"
                error={errFrom}
              />
              <FormField
                label="이후 값"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                inputMode="decimal"
                error={errTo}
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="A (기준 값)"
                value={a}
                onChange={(e) => setA(e.target.value)}
                inputMode="decimal"
                error={errA}
              />
              <FormField
                label="B (퍼센트 %)"
                value={b}
                onChange={(e) => setB(e.target.value)}
                inputMode="decimal"
                error={errB}
              />
            </div>
          )}

          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        changeFromZero ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
            이전 값이 0이면 변화율을 계산할 수 없습니다.
          </div>
        ) : result !== null && !hasErr ? (
          <ResultCard
            primaryLabel={primary.label}
            primaryValue={primary.value}
            copyText={primary.copy}
            description={
              mode === "chg"
                ? "이전 값이 0이면 변화율을 계산할 수 없습니다."
                : "퍼센트는 소수점이 길어질 수 있어 필요 시 반올림해 사용하세요."
            }
          />
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
            값을 입력하면 결과가 여기에 표시됩니다.
          </div>
        )
      }
    />
  );
}
