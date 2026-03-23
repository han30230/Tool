"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "bin" | "hex";

type BinaryConverterToolProps = { tool: ResolvedTool };

export function BinaryConverterTool({ tool }: BinaryConverterToolProps) {
  const [mode, setMode] = useState<Mode>("bin");
  const [raw, setRaw] = useState("1010");

  const out = useMemo(() => {
    const t = raw.trim().replace(/\s/g, "");
    if (t === "") return { ok: false as const, msg: "" };
    try {
      if (mode === "bin") {
        if (!/^[01]+$/.test(t)) return { ok: false as const, msg: "0과 1만 사용하세요." };
        const n = BigInt("0b" + t);
        return { ok: true as const, dec: n.toString(10), hex: n.toString(16).toUpperCase() };
      }
      if (!/^[0-9a-fA-F]+$/.test(t)) return { ok: false as const, msg: "16진 문자만 사용하세요." };
      const n = BigInt("0x" + t);
      return { ok: true as const, dec: n.toString(10), bin: n.toString(2) };
    } catch {
      return { ok: false as const, msg: "범위를 확인하세요." };
    }
  }, [raw, mode]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setMode("bin")} className={`rounded-full px-4 py-2 text-sm font-medium ${mode === "bin" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}>
              2진 → 10·16진
            </button>
            <button type="button" onClick={() => setMode("hex")} className={`rounded-full px-4 py-2 text-sm font-medium ${mode === "hex" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}>
              16진 → 10·2진
            </button>
          </div>
          <FormTextarea label={mode === "bin" ? "2진수" : "16진수 (0-9A-F)"} value={raw} onChange={(e) => setRaw(e.target.value)} className="min-h-[80px] font-mono text-sm" />
          <ToolActionBar onReset={() => setRaw("")} onExample={() => setRaw(mode === "bin" ? "1010" : "FF")} />
        </div>
      }
      resultSlot={
        out.ok ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 font-mono text-sm">
            <p>10진: {out.dec}</p>
            {mode === "bin" ? <p className="mt-2">16진: {out.hex}</p> : <p className="mt-2 break-all">2진: {out.bin}</p>}
          </div>
        ) : out.msg ? (
          <p className="text-sm text-amber-700 dark:text-amber-300">{out.msg}</p>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">값을 입력하세요.</div>
        )
      }
    />
  );
}
