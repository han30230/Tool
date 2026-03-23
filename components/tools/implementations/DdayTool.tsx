"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { calculateDday } from "@/lib/calculations/dday";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

function todayYmd(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type DdayToolProps = { tool: ResolvedTool };

export function DdayTool({ tool }: DdayToolProps) {
  const [base, setBase] = useState(todayYmd);
  const [target, setTarget] = useState("2026-12-25");

  const result = useMemo(() => calculateDday(base, target), [base, target]);

  const err = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(base)) return "기준일을 YYYY-MM-DD로 입력하세요.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(target)) return "목표일을 YYYY-MM-DD로 입력하세요.";
    if (result === null) return "날짜를 확인해 주세요.";
    return undefined;
  }, [base, target, result]);

  const copyText = useMemo(() => {
    if (!result || err) return "";
    return `${result.label}\n기준일: ${base}\n목표일: ${target}\n일 수 차이: ${result.days}일`;
  }, [result, err, base, target]);

  const handleReset = useCallback(() => {
    setBase(todayYmd());
    setTarget("");
  }, []);

  const handleExample = useCallback(() => {
    setBase(todayYmd());
    setTarget("2026-12-25");
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="기준일 (오늘 등)"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            placeholder={todayYmd()}
          />
          <FormField
            label="목표일 (시험·여행 등)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="2026-12-25"
          />
          {err ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {err}
            </p>
          ) : null}
          <p className="text-xs text-[var(--muted)]">
            일 수는 날짜 계산기와 같은 방식(종료 − 시작)입니다. 목표가 지났으면 음수·D+ 형태로 보입니다.
          </p>
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        result && !err ? (
          <ResultCard
            primaryLabel="D-day"
            primaryValue={result.label}
            copyText={copyText}
            description={
              result.days === 0
                ? "기준일과 목표일이 같습니다."
                : result.days > 0
                  ? `목표일까지 ${result.days}일 남았습니다.`
                  : `목표일이 ${Math.abs(result.days)}일 지났습니다.`
            }
            extraRows={[
              { label: "일 수 차이", value: `${result.days}일` },
              { label: "기준일", value: base },
              { label: "목표일", value: target },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            기준일과 목표일을 입력하면 D-day가 표시됩니다.
          </div>
        )
      }
    />
  );
}
