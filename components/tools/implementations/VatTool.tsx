"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { fromSupplyPrice, fromTotalInclVat } from "@/lib/calculations/vat";
import { formatWon, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "supply" | "total";

type VatToolProps = {
  tool: ResolvedTool;
};

export function VatTool({ tool }: VatToolProps) {
  const [mode, setMode] = useState<Mode>("supply");
  const [raw, setRaw] = useState("100000");

  const parsed = useMemo(() => parseAmount(raw), [raw]);

  const error = useMemo(() => {
    if (raw.trim() === "") return undefined;
    if (parsed === null) return "숫자만 입력할 수 있습니다.";
    if (parsed < 0) return "0원 이상만 입력할 수 있습니다.";
    return undefined;
  }, [raw, parsed]);

  const result = useMemo(() => {
    if (parsed === null || parsed < 0) return null;
    return mode === "supply" ? fromSupplyPrice(parsed) : fromTotalInclVat(parsed);
  }, [mode, parsed]);

  const handleReset = useCallback(() => {
    setRaw("");
    setMode("supply");
  }, []);

  const handleExample = useCallback(() => {
    setMode("supply");
    setRaw("100000");
  }, []);

  const copyText = useMemo(() => {
    if (!result) return "";
    return [
      `공급가액: ${formatWon(result.supply)}`,
      `부가세: ${formatWon(result.vat)}`,
      `합계: ${formatWon(result.total)}`,
    ].join("\n");
  }, [result]);

  const usageSlot = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        사용 방법
      </summary>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
        <li>
          <strong className="text-[var(--foreground)]">공급가액 기준</strong>: 세전 금액을 넣으면 부가세
          10%와 합계가 산출됩니다.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">부가세 포함가 기준</strong>: 카드·영수증에 보이는
          총액을 넣으면 공급가액과 부가세로 나눕니다.
        </li>
        <li>부가세율은 일반적으로 10%이며, 실제 신고·계약은 세무 전문가 확인이 필요합니다.</li>
      </ul>
    </details>
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
              onClick={() => setMode("supply")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "supply"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              공급가액 기준
            </button>
            <button
              type="button"
              onClick={() => setMode("total")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "total"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              부가세 포함가 기준
            </button>
          </div>
          <FormField
            label={mode === "supply" ? "공급가액 (원)" : "합계·부가세 포함 금액 (원)"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            inputMode="decimal"
            placeholder="예: 100000"
            helperText="숫자만 입력하세요. 쉼표는 자동으로 무시됩니다."
            error={error}
          />
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        result && !error ? (
          <ResultCard
            primaryLabel="합계"
            primaryValue={formatWon(result.total)}
            copyText={copyText}
            description="부가세 10% 기준입니다. 역산 시 원 단위 반올림 차이가 날 수 있습니다."
            extraRows={[
              { label: "공급가액", value: formatWon(result.supply) },
              { label: "부가세", value: formatWon(result.vat) },
            ]}
          />
        ) : (
          <div
            className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]"
            role="status"
          >
            {error
              ? "올바른 금액을 입력하면 결과가 여기에 표시됩니다."
              : "금액을 입력하면 공급가액·부가세·합계가 바로 계산됩니다."}
          </div>
        )
      }
    />
  );
}
