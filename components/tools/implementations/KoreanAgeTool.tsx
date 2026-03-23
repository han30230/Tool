"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { calculateKoreanAge } from "@/lib/calculations/koreanAge";
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

type KoreanAgeToolProps = { tool: ResolvedTool };

export function KoreanAgeTool({ tool }: KoreanAgeToolProps) {
  const [birth, setBirth] = useState("1990-05-15");
  const [ref, setRef] = useState(todayYmd);

  const result = useMemo(() => calculateKoreanAge(birth, ref), [birth, ref]);

  const err = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth)) return "생년월일을 YYYY-MM-DD로 입력하세요.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ref)) return "기준일을 YYYY-MM-DD로 입력하세요.";
    if (result === null) return "기준일이 생일보다 이전일 수 없습니다.";
    return undefined;
  }, [birth, ref, result]);

  const copyText = useMemo(() => {
    if (!result || err) return "";
    return `만 나이: ${result.manAge}세\n연도 차이: ${result.yearAge}\n세는 나이(참고): ${result.traditionalCountingAge}세`;
  }, [result, err]);

  const handleReset = useCallback(() => {
    setBirth("");
    setRef(todayYmd());
  }, []);

  const handleExample = useCallback(() => {
    setBirth("1990-05-15");
    setRef(todayYmd());
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="생년월일 (YYYY-MM-DD)"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            placeholder="1990-05-15"
          />
          <FormField
            label="기준일 (YYYY-MM-DD)"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder={todayYmd()}
          />
          {err ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {err}
            </p>
          ) : null}
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        result && !err ? (
          <ResultCard
            primaryLabel="만 나이"
            primaryValue={`${result.manAge}세`}
            copyText={copyText}
            description="‘세는 나이’는 연도만 보는 단순 참고값이며, 법·행정 연령과 다를 수 있습니다."
            extraRows={[
              { label: "연도 차이(참고)", value: `${result.yearAge}년` },
              { label: "세는 나이(참고)", value: `${result.traditionalCountingAge}세` },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            생년월일과 기준일을 입력하면 만 나이 등이 표시됩니다.
          </div>
        )
      }
    />
  );
}
