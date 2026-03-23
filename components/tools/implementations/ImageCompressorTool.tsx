"use client";

import imageCompression from "browser-image-compression";
import { useCallback, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";

function formatBytes(n: number): string {
  if (n < 1024) return `${Math.round(n)} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

type ImageCompressorToolProps = { tool: ResolvedTool };

export function ImageCompressorTool({ tool }: ImageCompressorToolProps) {
  const [qualityRaw, setQualityRaw] = useState("0.8");
  const [maxSide, setMaxSide] = useState("1920");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [beforeSize, setBeforeSize] = useState<number | null>(null);
  const [afterSize, setAfterSize] = useState<number | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outExt, setOutExt] = useState("jpg");
  const [fileName, setFileName] = useState("");

  const quality = Math.min(1, Math.max(0.1, parseFloat(qualityRaw.replace(",", ".")) || 0.8));
  const maxW = Math.min(8192, Math.max(320, parseInt(maxSide.replace(/\D/g, ""), 10) || 1920));

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 선택할 수 있습니다.");
        return;
      }
      setBusy(true);
      setError(undefined);
      setOutUrl((u) => {
        if (u) URL.revokeObjectURL(u);
        return null;
      });
      try {
        setBeforeSize(file.size);
        setFileName(file.name.replace(/\.[^.]+$/, "") || "image");
        const opts = {
          maxSizeMB: 50,
          maxWidthOrHeight: maxW,
          useWebWorker: true,
          initialQuality: quality,
        };
        const out = await imageCompression(file, opts);
        setAfterSize(out.size);
        setOutExt(out.type.includes("png") ? "png" : "jpg");
        const url = URL.createObjectURL(out);
        setOutUrl(url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "압축에 실패했습니다.");
        setBeforeSize(null);
        setAfterSize(null);
      } finally {
        setBusy(false);
      }
    },
    [quality, maxW],
  );

  const onInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) void processFile(f);
      e.target.value = "";
    },
    [processFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) void processFile(f);
    },
    [processFile],
  );

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            파일은 브라우저에서만 읽고 압축합니다. 서버로 업로드하지 않습니다.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="품질 (0.1–1)"
              value={qualityRaw}
              onChange={(e) => setQualityRaw(e.target.value)}
              inputMode="decimal"
              placeholder="0.8"
            />
            <FormField
              label="긴 변 최대 (px)"
              value={maxSide}
              onChange={(e) => setMaxSide(e.target.value)}
              inputMode="numeric"
            />
          </div>
          <label
            htmlFor="img-file"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--card-inner)] px-4 py-8 text-center text-sm text-[var(--muted)] transition hover:border-[var(--accent)]/40"
          >
            <span className="font-medium text-[var(--foreground)]">파일 선택 또는 끌어다 놓기</span>
            <span className="mt-1 text-xs">JPG, PNG, WebP 등</span>
            <input id="img-file" type="file" accept="image/*" className="sr-only" onChange={onInput} />
          </label>
          {busy ? <p className="text-sm text-[var(--muted)]">처리 중…</p> : null}
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      }
      resultSlot={
        outUrl && beforeSize !== null && afterSize !== null ? (
          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[var(--muted)]">압축 전</dt>
                <dd className="font-semibold tabular-nums text-[var(--foreground)]">{formatBytes(beforeSize)}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">압축 후</dt>
                <dd className="font-semibold tabular-nums text-[var(--foreground)]">{formatBytes(afterSize)}</dd>
              </div>
            </dl>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={outUrl} alt="압축 결과 미리보기" className="max-h-64 w-auto rounded-lg border border-[var(--border)]" />
            <a
              href={outUrl}
              download={`${fileName}-compressed.${outExt}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)]"
            >
              다운로드
            </a>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            이미지를 선택하면 압축 전후 용량과 미리보기가 나타납니다.
          </div>
        )
      }
    />
  );
}
