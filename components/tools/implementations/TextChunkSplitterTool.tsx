"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatNumber } from "@/lib/format/ko";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type TextChunkSplitterToolProps = { tool: ResolvedTool };
type SplitMode = "chars" | "sentence";

function splitBySize(text: string, size: number, overlap: number): string[] {
  if (!text) return [];
  const out: string[] = [];
  const chars = [...text];
  let start = 0;
  while (start < chars.length) {
    const end = Math.min(chars.length, start + size);
    out.push(chars.slice(start, end).join(""));
    if (end >= chars.length) break;
    start = Math.max(0, end - overlap);
  }
  return out;
}

export function TextChunkSplitterTool({ tool }: TextChunkSplitterToolProps) {
  const [text, setText] = useState("긴 문서를 임베딩이나 요약 전처리할 때 일정 길이로 나눕니다.");
  const [chunkRaw, setChunkRaw] = useState("500");
  const [overlapRaw, setOverlapRaw] = useState("50");
  const [mode, setMode] = useState<SplitMode>("chars");
  const chunkSize = useMemo(() => Math.max(1, parseInt(chunkRaw.replace(/\D/g, ""), 10) || 500), [chunkRaw]);
  const overlap = useMemo(() => Math.max(0, parseInt(overlapRaw.replace(/\D/g, ""), 10) || 0), [overlapRaw]);
  const safeOverlap = Math.min(overlap, Math.max(0, chunkSize - 1));
  const chunks = useMemo(() => {
    if (mode === "chars") return splitBySize(text, chunkSize, safeOverlap);
    return splitBySentenceAware(text, chunkSize, safeOverlap);
  }, [text, chunkSize, safeOverlap, mode]);
  const chunkStats = useMemo(() => {
    if (chunks.length === 0) {
      return { avgLen: 0, maxLen: 0, tokenSum: 0 };
    }
    const lengths = chunks.map((c) => [...c].length);
    const totalLen = lengths.reduce((a, b) => a + b, 0);
    const maxLen = Math.max(...lengths);
    const avgLen = totalLen / chunks.length;
    const tokenSum = chunks.reduce((sum, c) => sum + Math.ceil([...c].length / 3.6), 0);
    return { avgLen, maxLen, tokenSum };
  }, [chunks]);

  const copyChunks = async () => {
    const body = chunks
      .map((c, i) => `# Chunk ${i + 1}\n${c}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(body);
    } catch {
      /* ignore */
    }
  };

  const downloadJson = () => {
    const payload = {
      mode,
      chunkSize,
      overlap: safeOverlap,
      count: chunks.length,
      chunks: chunks.map((content, idx) => ({ index: idx + 1, content })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chunks.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("chars")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "chars" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              문자 길이 기준
            </button>
            <button
              type="button"
              onClick={() => setMode("sentence")}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "sentence" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              문장 경계 우선
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="청크 길이(문자)" value={chunkRaw} onChange={(e) => setChunkRaw(e.target.value)} inputMode="numeric" />
            <FormField label="오버랩(문자)" value={overlapRaw} onChange={(e) => setOverlapRaw(e.target.value)} inputMode="numeric" />
          </div>
          <FormTextarea label="원문" value={text} onChange={(e) => setText(e.target.value)} className="min-h-[180px]" />
          <ToolActionBar onReset={() => setText("")} onExample={() => setText("문단이 긴 텍스트를 임베딩 전에 분할할 때는 청크와 오버랩을 함께 조정합니다.")} />
        </div>
      }
      resultSlot={
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
            총 {formatNumber(chunks.length)}개 청크 · 오버랩 {formatNumber(safeOverlap)}자 · 분할 방식: {mode === "chars" ? "문자 길이" : "문장 경계"}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-inner)] p-3 text-sm">
              <p className="text-xs text-[var(--muted)]">평균 청크 길이</p>
              <p className="mt-1 font-semibold text-[var(--foreground)]">{formatNumber(chunkStats.avgLen, 1)}자</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-inner)] p-3 text-sm">
              <p className="text-xs text-[var(--muted)]">최대 청크 길이</p>
              <p className="mt-1 font-semibold text-[var(--foreground)]">{formatNumber(chunkStats.maxLen, 0)}자</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-inner)] p-3 text-sm">
              <p className="text-xs text-[var(--muted)]">추정 토큰 합계</p>
              <p className="mt-1 font-semibold text-[var(--foreground)]">{formatNumber(chunkStats.tokenSum, 0)} tokens</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyChunks()}
              className="min-h-[44px] rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)]"
            >
              청크 전체 복사
            </button>
            <button
              type="button"
              onClick={downloadJson}
              className="min-h-[44px] rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)]"
            >
              JSON 내보내기
            </button>
          </div>
          <ul className="space-y-3">
            {chunks.map((c, i) => (
              <li key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                <p className="text-xs font-semibold text-[var(--accent)]">Chunk {i + 1}</p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[var(--foreground)]">{c}</p>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}

function splitBySentenceAware(text: string, size: number, overlap: number): string[] {
  if (!text.trim()) return [];
  const sentences = text
    .split(/(?<=[.!?。！？]\s+)|(?<=[.!?。！？])$/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length === 0) return splitBySize(text, size, overlap);

  const chunks: string[] = [];
  let buffer = "";
  for (const sentence of sentences) {
    const next = buffer ? `${buffer} ${sentence}` : sentence;
    if ([...next].length <= size) {
      buffer = next;
      continue;
    }
    if (buffer) chunks.push(buffer);
    if ([...sentence].length > size) {
      chunks.push(...splitBySize(sentence, size, overlap));
      buffer = "";
      continue;
    }
    buffer = sentence;
  }
  if (buffer) chunks.push(buffer);
  return applyOverlapOnSentenceChunks(chunks, overlap);
}

function applyOverlapOnSentenceChunks(chunks: string[], overlap: number): string[] {
  if (overlap <= 0) return chunks;
  return chunks.map((chunk, i) => {
    if (i === 0) return chunk;
    const prev = [...chunks[i - 1]];
    const head = prev.slice(Math.max(0, prev.length - overlap)).join("");
    return `${head}${chunk}`;
  });
}

