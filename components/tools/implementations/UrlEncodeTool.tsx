"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Mode = "encode" | "decode";

type UrlEncodeToolProps = { tool: ResolvedTool };

export function UrlEncodeTool({ tool }: UrlEncodeToolProps) {
  const [raw, setRaw] = useState("한글 쿼리=test&num=1");
  const [mode, setMode] = useState<Mode>("encode");

  const encoded = useMemo(() => {
    try {
      return encodeURIComponent(raw);
    } catch {
      return "";
    }
  }, [raw]);

  const decoded = useMemo(() => {
    try {
      return decodeURIComponent(raw.replace(/\+/g, "%20"));
    } catch {
      return "";
    }
  }, [raw]);

  const display = mode === "encode" ? encoded : decoded;
  const err = useMemo(() => {
    if (mode === "decode" && raw.trim() !== "" && decoded === "") return "디코딩할 수 없는 문자열입니다.";
    return undefined;
  }, [mode, raw, decoded]);

  const handleReset = useCallback(() => {
    setRaw("");
    setMode("encode");
  }, []);

  const handleExample = useCallback(() => {
    setRaw("한글 쿼리=test&num=1");
    setMode("encode");
  }, []);

  const copyBlock = (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
      <p className="text-xs font-medium text-[var(--muted)]">
        {mode === "encode" ? "encodeURIComponent 결과" : "decodeURIComponent 결과"}
      </p>
      <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-[var(--foreground)]">
        {err ? "—" : display || "(빈 값)"}
      </pre>
      {err ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {err}
        </p>
      ) : null}
    </div>
  );

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
              인코딩
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
              디코딩
            </button>
          </div>
          <FormTextarea
            label={mode === "encode" ? "원문 (UTF-8)" : "인코딩된 문자열"}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
          <p className="text-xs text-[var(--muted)]">
            쿼리스트링 조각·파라미터 값에 쓰기 좋습니다. 전체 URL 파싱은 브라우저·서버 환경에 따라 다릅니다.
          </p>
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={copyBlock}
    />
  );
}
