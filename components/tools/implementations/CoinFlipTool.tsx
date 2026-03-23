"use client";

import { useCallback, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

function flip(): "앞면" | "뒷면" {
  const n =
    typeof crypto !== "undefined" && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint32Array(1))[0]! % 2
      : Math.floor(Math.random() * 2);
  return n === 0 ? "앞면" : "뒷면";
}

type CoinFlipToolProps = { tool: ResolvedTool };

export function CoinFlipTool({ tool }: CoinFlipToolProps) {
  const [last, setLast] = useState<"앞면" | "뒷면" | null>(null);
  const [count, setCount] = useState(0);

  const go = useCallback(() => {
    setLast(flip());
    setCount((c) => c + 1);
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <button
            type="button"
            onClick={go}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-4 text-base font-semibold text-white shadow-[var(--shadow-md)]"
          >
            동전 던지기
          </button>
          <ToolActionBar
            onReset={() => {
              setLast(null);
              setCount(0);
            }}
            onExample={go}
          />
        </div>
      }
      resultSlot={
        last ? (
          <ResultCard primaryLabel="결과" primaryValue={last} copyText={last} description={`총 ${count}번 던짐`} />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            버튼을 눌러 보세요.
          </div>
        )
      }
    />
  );
}
