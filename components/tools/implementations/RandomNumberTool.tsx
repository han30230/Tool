"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

function randomIntInclusive(min: number, max: number): number {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const range = hi - lo + 1;
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return lo + (buf[0]! % range);
  }
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

type RandomNumberToolProps = { tool: ResolvedTool };

export function RandomNumberTool({ tool }: RandomNumberToolProps) {
  const [minV, setMinV] = useState("1");
  const [maxV, setMaxV] = useState("45");
  const [count, setCount] = useState("6");
  const [unique, setUnique] = useState(true);
  const [out, setOut] = useState<number[]>([]);

  const minN = useMemo(() => {
    const t = minV.trim();
    if (t === "" || !/^-?\d+$/.test(t)) return NaN;
    return parseInt(t, 10);
  }, [minV]);
  const maxN = useMemo(() => {
    const t = maxV.trim();
    if (t === "" || !/^-?\d+$/.test(t)) return NaN;
    return parseInt(t, 10);
  }, [maxV]);
  const cnt = useMemo(() => parseInt(count.replace(/\D/g, ""), 10), [count]);

  const err = useMemo(() => {
    if (!Number.isFinite(minN) || !Number.isFinite(maxN)) return "최소·최대는 정수로 입력하세요.";
    if (minN > maxN) return "최소값이 최대값보다 클 수 없습니다.";
    if (!Number.isFinite(cnt) || cnt < 1 || cnt > 100) return "개수는 1~100입니다.";
    if (unique && maxN - minN + 1 < cnt) return "서로 다른 수를 뽑을 수 없습니다. 범위를 넓히거나 개수를 줄이세요.";
    return undefined;
  }, [minN, maxN, cnt, unique]);

  const draw = useCallback(() => {
    if (err) return;
    if (unique) {
      const pool: number[] = [];
      for (let i = minN; i <= maxN; i++) pool.push(i);
      shuffleInPlaceNums(pool);
      setOut(pool.slice(0, cnt));
      return;
    }
    const arr: number[] = [];
    for (let i = 0; i < cnt; i++) arr.push(randomIntInclusive(minN, maxN));
    setOut(arr);
  }, [err, minN, maxN, cnt, unique]);

  const copyText = useMemo(() => out.map((n) => String(n)).join(", "), [out]);

  const handleReset = useCallback(() => {
    setMinV("1");
    setMaxV("45");
    setCount("6");
    setUnique(true);
    setOut([]);
  }, []);

  const handleExample = useCallback(() => {
    setMinV("1");
    setMaxV("45");
    setCount("6");
    setUnique(true);
    const pool: number[] = [];
    for (let i = 1; i <= 45; i++) pool.push(i);
    shuffleInPlaceNums(pool);
    setOut(pool.slice(0, 6));
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="최소" value={minV} onChange={(e) => setMinV(e.target.value)} inputMode="numeric" />
          <FormField label="최대" value={maxV} onChange={(e) => setMaxV(e.target.value)} inputMode="numeric" />
          <FormField label="개수" value={count} onChange={(e) => setCount(e.target.value)} inputMode="numeric" />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={unique}
              onChange={(e) => setUnique(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--border)]"
            />
            중복 없이 뽑기 (범위 안에서)
          </label>
          <button
            type="button"
            onClick={draw}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition hover:opacity-95"
          >
            추첨
          </button>
          {err ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {err}
            </p>
          ) : null}
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        out.length > 0 && !err ? (
          <ResultCard
            primaryLabel="결과"
            primaryValue={out.map((n) => formatNumber(n)).join(", ")}
            copyText={copyText}
            description="복권·경품 등 법적 효력이 필요하면 공식 절차를 따르세요. 참고용입니다."
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            범위와 개수를 정한 뒤「추첨」을 누르세요.
          </div>
        )
      }
    />
  );
}

function shuffleInPlaceNums(arr: number[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j =
      typeof crypto !== "undefined" && crypto.getRandomValues
        ? crypto.getRandomValues(new Uint32Array(1))[0]! % (i + 1)
        : Math.floor(Math.random() * (i + 1));
    const a = arr[i];
    const b = arr[j];
    if (a !== undefined && b !== undefined) {
      arr[i] = b;
      arr[j] = a;
    }
  }
}
