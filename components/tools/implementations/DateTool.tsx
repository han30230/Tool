"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { addCalendarDays, diffCalendarDays } from "@/lib/calculations/dateCalc";
import { formatNumber, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "diff" | "add";

type DateToolProps = {
  tool: ResolvedTool;
};

function todayYmd(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DateTool({ tool }: DateToolProps) {
  const [mode, setMode] = useState<Mode>("diff");
  const [start, setStart] = useState(todayYmd);
  const [end, setEnd] = useState(todayYmd);
  const [base, setBase] = useState(todayYmd);
  const [delta, setDelta] = useState("7");

  const diff = useMemo(() => diffCalendarDays(start, end), [start, end]);

  const deltaNum = useMemo(() => parseAmount(delta), [delta]);
  const deltaErr = useMemo(() => {
    if (delta.trim() === "") return undefined;
    if (deltaNum === null) return "숫자만 입력할 수 있습니다.";
    if (!Number.isInteger(deltaNum) && !Number.isFinite(deltaNum)) return undefined;
    return undefined;
  }, [delta, deltaNum]);

  const added = useMemo(() => {
    if (deltaNum === null) return null;
    return addCalendarDays(base, Math.trunc(deltaNum));
  }, [base, deltaNum]);

  const diffCopy = useMemo(() => {
    if (diff === null) return "";
    return `시작일: ${start}\n종료일: ${end}\n일 수 차이: ${diff}일`;
  }, [diff, start, end]);

  const addCopy = useMemo(() => {
    if (!added) return "";
    return `기준일: ${base}\n더한 일수: ${Math.trunc(deltaNum ?? 0)}일\n결과일: ${added}`;
  }, [added, base, deltaNum]);

  const handleReset = useCallback(() => {
    const t = todayYmd();
    setMode("diff");
    setStart(t);
    setEnd(t);
    setBase(t);
    setDelta("");
  }, []);

  const handleExample = useCallback(() => {
    if (mode === "diff") {
      setStart("2025-01-01");
      setEnd("2025-12-31");
    } else {
      setBase(todayYmd());
      setDelta("100");
    }
  }, [mode]);

  const usageSlot = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        사용 방법
      </summary>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
        <li>
          <strong className="text-[var(--foreground)]">기간</strong>: 종료일 − 시작일의 일 수입니다.
          D-day처럼 &quot;목표일까지 며칠 남았는지&quot;는 시작을 오늘, 종료를 목표일로 두면 읽을 수
          있습니다.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">날짜 더하기</strong>: 기준일에 정수 일수를 더하거나
          빼면(음수) 결과 날짜를 구합니다.
        </li>
        <li>윤년·월말은 브라우저 달력 규칙을 따릅니다.</li>
      </ul>
    </details>
  );

  const resultSlot =
    mode === "diff" ? (
      diff !== null ? (
        <ResultCard
          primaryLabel="일 수 차이 (종료일 − 시작일)"
          primaryValue={`${formatNumber(diff)}일`}
          copyText={diffCopy}
          description={
            diff >= 0
              ? "시작일보다 종료일이 같거나 늦은 경우입니다. D-day로 쓰려면 ‘시작=오늘, 종료=목표일’로 해석해 보세요."
              : "종료일이 시작일보다 이릅니다. 음수는 ‘역방향’ 일 수입니다."
          }
        />
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
          날짜를 선택해 주세요.
        </div>
      )
    ) : added && deltaNum !== null && !deltaErr ? (
      <ResultCard
        primaryLabel="결과 날짜"
        primaryValue={added}
        copyText={addCopy}
        description={`기준일 ${base}에 ${Math.trunc(deltaNum)}일을 더한 날짜입니다. 빼기는 일수에 음수를 넣으세요.`}
      />
    ) : (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
        {deltaErr ?? "기준일과 일수를 입력하면 결과 날짜가 표시됩니다."}
      </div>
    );

  return (
    <ToolPageLayout
      tool={tool}
      usageSlot={usageSlot}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("diff")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "diff"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              두 날짜 차이
            </button>
            <button
              type="button"
              onClick={() => setMode("add")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "add"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              날짜 더하기·빼기
            </button>
          </div>

          {mode === "diff" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                  시작일
                </label>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full min-h-[44px] rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-base text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                  종료일
                </label>
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full min-h-[44px] rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-base text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                  기준일
                </label>
                <input
                  type="date"
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                  className="w-full min-h-[44px] rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-base text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                />
              </div>
              <FormField
                label="더할 일수 (음수면 빼기)"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
                inputMode="numeric"
                placeholder="예: 7 또는 -3"
                error={deltaErr}
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
