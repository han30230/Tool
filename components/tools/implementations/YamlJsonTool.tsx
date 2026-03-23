"use client";

import { useCallback, useMemo, useState } from "react";
import yaml from "js-yaml";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const SAMPLE_YAML = `name: 툴모음
version: 1
tags:
  - yaml
  - json
enabled: true`;

const SAMPLE_JSON = `{
  "name": "툴모음",
  "version": 1,
  "tags": ["yaml", "json"],
  "enabled": true
}`;

type Mode = "yaml-to-json" | "json-to-yaml";

type YamlJsonToolProps = { tool: ResolvedTool };

export function YamlJsonTool({ tool }: YamlJsonToolProps) {
  const [mode, setMode] = useState<Mode>("yaml-to-json");
  const [raw, setRaw] = useState(SAMPLE_YAML);

  const result = useMemo(() => {
    const t = raw.trim();
    if (!t) return { ok: false as const, message: "", out: "" };
    try {
      if (mode === "yaml-to-json") {
        const data = yaml.load(t) as unknown;
        const out = JSON.stringify(data, null, 2);
        return { ok: true as const, message: "", out };
      }
      const data = JSON.parse(t) as unknown;
      const out = yaml.dump(data, { indent: 2, lineWidth: 120 });
      return { ok: true as const, message: "", out };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "변환 실패";
      return { ok: false as const, message: msg, out: "" };
    }
  }, [raw, mode]);

  const copy = useCallback(async () => {
    if (!result.ok || !result.out) return;
    try {
      await navigator.clipboard.writeText(result.out);
    } catch {
      /* ignore */
    }
  }, [result]);

  const label = mode === "yaml-to-json" ? "YAML 입력" : "JSON 입력";
  const outLabel = mode === "yaml-to-json" ? "JSON 결과" : "YAML 결과";

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <fieldset className="flex flex-wrap gap-4 text-sm">
            <legend className="sr-only">변환 방향</legend>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="yj-mode"
                checked={mode === "yaml-to-json"}
                onChange={() => {
                  setMode("yaml-to-json");
                  setRaw(SAMPLE_YAML);
                }}
              />
              YAML → JSON
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="yj-mode"
                checked={mode === "json-to-yaml"}
                onChange={() => {
                  setMode("json-to-yaml");
                  setRaw(SAMPLE_JSON);
                }}
              />
              JSON → YAML
            </label>
          </fieldset>
          <FormTextarea
            label={label}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
            helperText="앵커·별칭 등 복잡한 YAML은 환경에 따라 결과가 달라질 수 있습니다."
          />
          <ToolActionBar
            onReset={() => setRaw("")}
            onExample={() => setRaw(mode === "yaml-to-json" ? SAMPLE_YAML : SAMPLE_JSON)}
          />
        </div>
      }
      resultSlot={
        result.ok ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-medium text-[var(--foreground)]">{outLabel}</h3>
              <button
                type="button"
                onClick={copy}
                className="min-h-[40px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                복사
              </button>
            </div>
            <textarea
              readOnly
              value={result.out}
              className="mt-3 w-full min-h-[260px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 font-mono text-xs text-[var(--foreground)] sm:text-sm"
              spellCheck={false}
              aria-label={outLabel}
            />
          </div>
        ) : result.message ? (
          <div
            className="rounded-xl border border-red-500/40 bg-[var(--card)] p-5 text-sm text-red-700 dark:text-red-300"
            role="alert"
          >
            <p className="font-medium">변환할 수 없습니다</p>
            <p className="mt-2 leading-relaxed">{result.message}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            내용을 입력하세요.
          </div>
        )
      }
    />
  );
}
