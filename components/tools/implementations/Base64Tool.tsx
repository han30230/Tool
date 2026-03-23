"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { utf8ToBase64, base64ToUtf8 } from "@/lib/encoding/utf8Base64";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "encode" | "decode";

type Base64ToolProps = { tool: ResolvedTool };

export function Base64Tool({ tool }: Base64ToolProps) {
  const [raw, setRaw] = useState("안녕 hello 123");
  const [mode, setMode] = useState<Mode>("encode");

  const display = useMemo(() => {
    if (mode === "encode") {
      try {
        return utf8ToBase64(raw);
      } catch {
        return "";
      }
    }
    try {
      return base64ToUtf8(raw);
    } catch {
      return "";
    }
  }, [mode, raw]);

  const decodeErr = useMemo(() => {
    if (mode !== "decode" || raw.trim() === "") return false;
    try {
      base64ToUtf8(raw);
      return false;
    } catch {
      return true;
    }
  }, [mode, raw]);

  const handleReset = useCallback(() => {
    setRaw("");
    setMode("encode");
  }, []);

  const handleExample = useCallback(() => {
    setRaw("안녕 hello 123");
    setMode("encode");
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("encode")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "encode"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              텍스트 → Base64
            </button>
            <button
              type="button"
              onClick={() => setMode("decode")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "decode"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              Base64 → 텍스트
            </button>
          </div>
          <FormTextarea
            label={mode === "encode" ? "일반 텍스트" : "Base64 문자열"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
          <p className="text-xs font-medium text-[var(--muted)]">
            {mode === "encode" ? "Base64" : "디코딩 결과"}
          </p>
          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-[var(--foreground)]">
            {decodeErr ? "(디코딩 실패)" : display || "(빈 값)"}
          </pre>
          {decodeErr ? (
            <p className="mt-2 text-sm text-amber-700 dark:text-amber-400" role="status">
              Base64 형식이 아니거나 손상된 데이터일 수 있습니다.
            </p>
          ) : null}
        </div>
      }
    />
  );
}
