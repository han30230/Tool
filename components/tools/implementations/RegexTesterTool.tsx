"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type RegexTesterToolProps = { tool: ResolvedTool };

export function RegexTesterTool({ tool }: RegexTesterToolProps) {
  const [pattern, setPattern] = useState("\\d+");
  const [flags, setFlags] = useState("g");
  const [hay, setHay] = useState("abc 123 def 456");

  const result = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags.replace(/[^gimsuy]/g, ""));
      const matches = [...hay.matchAll(re)];
      return { ok: true as const, matches, error: null as string | null };
    } catch (e) {
      return { ok: false as const, matches: [] as RegExpMatchArray[], error: (e as Error).message };
    }
  }, [pattern, flags, hay]);

  const summary = result.ok
    ? `매치 ${result.matches.length}건`
    : result.error ?? "오류";

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="정규식 패턴"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            inputClassName="font-mono text-sm"
          />
          <FormField label="플래그 (g i m s u y)" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="g" />
          <FormTextarea label="본문" value={hay} onChange={(e) => setHay(e.target.value)} className="min-h-[100px] font-mono text-sm" />
          <ToolActionBar onReset={() => { setPattern(""); setFlags("g"); setHay(""); }} onExample={() => { setPattern("\\d+"); setFlags("g"); setHay("abc 123 def 456"); }} />
        </div>
      }
      resultSlot={
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-medium text-[var(--foreground)]">{summary}</p>
          {result.ok && result.matches.length > 0 ? (
            <ul className="max-h-48 space-y-1 overflow-auto font-mono text-xs text-[var(--muted)]">
              {result.matches.map((m, i) => (
                <li key={i}>
                  [{i}] “{m[0]}” @ {m.index}
                </li>
              ))}
            </ul>
          ) : result.ok ? (
            <p className="text-sm text-[var(--muted)]">매치 없음</p>
          ) : (
            <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
          )}
        </div>
      }
    />
  );
}
