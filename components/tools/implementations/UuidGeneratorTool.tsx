"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

function makeUuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type UuidGeneratorToolProps = { tool: ResolvedTool };

export function UuidGeneratorTool({ tool }: UuidGeneratorToolProps) {
  const [count, setCount] = useState("3");
  const [lines, setLines] = useState<string[]>([]);

  const n = useMemo(() => parseInt(count.replace(/\D/g, ""), 10), [count]);

  const generate = useCallback(() => {
    const c = Number.isFinite(n) ? Math.min(20, Math.max(1, n)) : 1;
    setLines(Array.from({ length: c }, () => makeUuid()));
  }, [n]);

  const text = lines.join("\n");

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="개수 (1~20)" value={count} onChange={(e) => setCount(e.target.value)} inputMode="numeric" />
          <button
            type="button"
            onClick={generate}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)]"
          >
            UUID 생성
          </button>
          <ToolActionBar
            onReset={() => setLines([])}
            onExample={() => {
              setCount("3");
              setLines(Array.from({ length: 3 }, () => makeUuid()));
            }}
          />
        </div>
      }
      resultSlot={
        lines.length > 0 ? (
          <ResultCard primaryLabel="UUID v4" primaryValue={lines[0] ?? ""} copyText={text} description={lines.length > 1 ? `${lines.length}개 생성` : undefined} extraRows={lines.slice(1).map((l, i) => ({ label: `#${i + 2}`, value: l }))} />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            개수를 정한 뒤 생성하세요.
          </div>
        )
      }
    />
  );
}
