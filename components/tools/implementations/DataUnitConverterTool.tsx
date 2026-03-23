"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import {
  type DataUnit,
  UNIT_STEPS,
  convertDataUnits,
} from "@/lib/calculations/unitConvert";
import { formatNumber, parseAmount } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type DataUnitConverterToolProps = { tool: ResolvedTool };

export function DataUnitConverterTool({ tool }: DataUnitConverterToolProps) {
  const [fromUnit, setFromUnit] = useState<DataUnit>("mb");
  const [raw, setRaw] = useState("1");

  const parsed = useMemo(() => parseAmount(raw), [raw]);

  const error = useMemo(() => {
    if (raw.trim() === "") return undefined;
    if (parsed === null) return "숫자만 입력할 수 있습니다.";
    if (parsed < 0) return "0 이상만 입력할 수 있습니다.";
    return undefined;
  }, [raw, parsed]);

  const rows = useMemo(() => {
    if (parsed === null || parsed < 0) return null;
    return UNIT_STEPS.map((u) => ({
      label: u.label,
      value: formatNumber(convertDataUnits(parsed, fromUnit, u.id), 10),
    }));
  }, [parsed, fromUnit]);

  const primaryMb = useMemo(() => {
    if (parsed === null || parsed < 0) return null;
    return convertDataUnits(parsed, fromUnit, "mb");
  }, [parsed, fromUnit]);

  const copyText = useMemo(() => {
    if (parsed === null || !rows) return "";
    const fromLabel = UNIT_STEPS.find((u) => u.id === fromUnit)?.label ?? "";
    const lines = [
      `입력: ${formatNumber(parsed, 10)} ${fromLabel}`,
      ...rows.map((r) => `${r.label}: ${r.value}`),
      "기준: 1024배 (이진)",
    ];
    return lines.join("\n");
  }, [parsed, rows, fromUnit]);

  const handleReset = useCallback(() => {
    setRaw("");
    setFromUnit("mb");
  }, []);

  const handleExample = useCallback(() => {
    setFromUnit("gb");
    setRaw("1");
  }, []);

  const hasResult = primaryMb !== null && rows && !error;

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">1 KB = 1024 B, 1 MB = 1024 KB … (IEC 이진 기준)</p>
          <div>
            <label htmlFor="du-from" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
              기준 단위
            </label>
            <select
              id="du-from"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as DataUnit)}
              className="w-full min-h-[48px] rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-base text-[var(--foreground)] shadow-[var(--shadow-sm)] outline-none focus:border-[var(--accent)]/40 focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
            >
              {UNIT_STEPS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <FormField
            label="값"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            inputMode="decimal"
            placeholder="예: 1.5"
            error={error}
          />
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        hasResult ? (
          <ResultCard
            primaryLabel="MB 기준으로 보면"
            primaryValue={formatNumber(primaryMb, 10)}
            copyText={copyText}
            description="아래는 B·KB·MB·GB·TB 모두 같은 양을 단위만 바꿔 표시합니다."
            extraRows={rows.map((r) => ({ label: r.label, value: r.value }))}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
            숫자를 입력하면 다른 단위로 환산됩니다.
          </div>
        )
      }
    />
  );
}
