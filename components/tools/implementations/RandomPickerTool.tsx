"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";
import { FormField } from "@/components/tool-page/FormField";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j =
      typeof crypto !== "undefined" && crypto.getRandomValues
        ? crypto.getRandomValues(new Uint32Array(1))[0]! % (i + 1)
        : Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function parseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function countLines(text: string): number {
  if (!text.trim()) return 0;
  return text.split(/\r?\n/).length;
}

type RandomPickerToolProps = { tool: ResolvedTool };

export function RandomPickerTool({ tool }: RandomPickerToolProps) {
  const [raw, setRaw] = useState("김철수\n이영희\n박민수");
  const [picked, setPicked] = useState<string | null>(null);
  const [multi, setMulti] = useState<string[]>([]);
  const [count, setCount] = useState("3");

  const n = useMemo(() => Math.min(50, Math.max(1, parseInt(count.replace(/\D/g, ""), 10) || 1)), [count]);

  const pickOne = useCallback(() => {
    setMulti([]);
    const ls = parseLines(raw);
    if (ls.length === 0) {
      setPicked(null);
      return;
    }
    const i =
      typeof crypto !== "undefined" && crypto.getRandomValues
        ? crypto.getRandomValues(new Uint32Array(1))[0]! % ls.length
        : Math.floor(Math.random() * ls.length);
    setPicked(ls[i] ?? null);
  }, [raw]);

  const pickMany = useCallback(() => {
    setPicked(null);
    const ls = parseLines(raw);
    if (ls.length === 0) {
      setMulti([]);
      return;
    }
    const k = Math.min(n, ls.length);
    const unique = [...new Set(ls)];
    const pool = unique.length >= k ? unique : ls;
    const shuffled = shuffle([...pool]);
    setMulti(shuffled.slice(0, k));
  }, [raw, n]);

  const shuffleList = useCallback(() => {
    setPicked(null);
    const ls = parseLines(raw);
    setMulti(shuffle(ls));
  }, [raw]);

  const multiText = multi.join("\n");
  const candidates = useMemo(() => parseLines(raw), [raw]);
  const lineCount = useMemo(() => countLines(raw), [raw]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormTextarea
            label="후보 (한 줄에 하나)"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[140px] font-mono text-sm"
          />
          <p className="text-xs text-[var(--muted)]">
            후보 {candidates.length}명 · 입력 줄 {lineCount}줄
          </p>
          <button
            type="button"
            onClick={pickOne}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)]"
          >
            하나 뽑기
          </button>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[8rem] flex-1">
              <FormField
                label="여러 명 뽑기 (최대)"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <button
              type="button"
              onClick={pickMany}
              className="min-h-[48px] min-w-[8rem] rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)]"
            >
              여러 명 뽑기
            </button>
          </div>
          <button
            type="button"
            onClick={shuffleList}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-inner)] px-4 py-3 text-sm font-medium text-[var(--foreground)]"
          >
            목록 순서만 무작위로 섞기
          </button>
          <ToolActionBar
            onReset={() => {
              setRaw("");
              setPicked(null);
              setMulti([]);
            }}
            onExample={() => setRaw("A팀\nB팀\nC팀")}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRaw("1번\n2번\n3번\n4번\n5번")}
              className="rounded-lg border border-[var(--border)] bg-[var(--card-inner)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
            >
              예: 번호 5개
            </button>
            <button
              type="button"
              onClick={() =>
                setRaw("김민수\n이서연\n박도윤\n최하린\n정우진\n한지아\n오승우\n강나래")
              }
              className="rounded-lg border border-[var(--border)] bg-[var(--card-inner)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
            >
              예: 이름 8명
            </button>
          </div>
        </div>
      }
      resultSlot={
        picked ? (
          <ResultCard
            primaryLabel="결과"
            primaryValue={picked}
            copyText={picked}
            description="공정 추첨이 필요하면 별도 절차를 따르세요."
          />
        ) : multi.length > 0 ? (
          <ResultCard
            primaryLabel="선택·섞기 결과"
            primaryValue={multi[0] ?? ""}
            copyText={multiText}
            description={`${multi.length}줄. 전체를 복사하면 목록 전체가 됩니다.`}
            extraRows={multi.slice(1).map((line, i) => ({ label: `#${i + 2}`, value: line }))}
          />
        ) : (
          <div
            className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]"
            role="status"
            aria-live="polite"
          >
            줄을 입력한 뒤 뽑기를 누르세요.
          </div>
        )
      }
    />
  );
}
