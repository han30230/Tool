"use client";

import Papa from "papaparse";
import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "csv-to-json" | "json-to-csv";

const CSV_EX = `name,age
홍길동,30
Jane,25`;

const JSON_EX = `[
  { "name": "홍길동", "age": 30 },
  { "name": "Jane", "age": 25 }
]`;

type CsvJsonToolProps = { tool: ResolvedTool };

export function CsvJsonTool({ tool }: CsvJsonToolProps) {
  const [mode, setMode] = useState<Mode>("csv-to-json");
  const [raw, setRaw] = useState(CSV_EX);

  const { out, error } = useMemo(() => {
    if (mode === "csv-to-json") {
      const parsed = Papa.parse<Record<string, string>>(raw, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(),
      });
      if (parsed.errors.length > 0) {
        const e = parsed.errors[0];
        return {
          out: "",
          error: `${e.message} (행 ${String(e.row ?? "?")})`,
        };
      }
      try {
        return { out: JSON.stringify(parsed.data, null, 2), error: undefined };
      } catch {
        return { out: "", error: "JSON으로 변환할 수 없습니다." };
      }
    }
    try {
      const data = JSON.parse(raw) as unknown;
      const rows = Array.isArray(data) ? data : [data];
      if (rows.length === 0) return { out: "", error: "빈 배열입니다." };
      if (typeof rows[0] !== "object" || rows[0] === null) {
        return { out: "", error: "객체 배열이 필요합니다." };
      }
      const csv = Papa.unparse(rows as Record<string, unknown>[], { header: true });
      return { out: csv, error: undefined };
    } catch (e) {
      return {
        out: "",
        error: e instanceof Error ? e.message : "JSON 파싱 오류",
      };
    }
  }, [mode, raw]);

  const copyOut = useCallback(async () => {
    if (!out) return;
    try {
      await navigator.clipboard.writeText(out);
    } catch {
      /* ignore */
    }
  }, [out]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("csv-to-json");
                setRaw(CSV_EX);
              }}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "csv-to-json"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              CSV → JSON
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("json-to-csv");
                setRaw(JSON_EX);
              }}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "json-to-csv"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              JSON → CSV
            </button>
          </div>
          <FormTextarea
            label={mode === "csv-to-json" ? "CSV" : "JSON"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <ToolActionBar
            onReset={() => setRaw("")}
            onExample={() => setRaw(mode === "csv-to-json" ? CSV_EX : JSON_EX)}
          />
        </div>
      }
      resultSlot={
        error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-300" role="alert">
            {error}
          </div>
        ) : out ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">결과</span>
              <button
                type="button"
                onClick={() => void copyOut()}
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white"
              >
                복사
              </button>
            </div>
            <pre className="max-h-[min(70vh,480px)] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-sm text-[var(--foreground)]">
              {out}
            </pre>
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
