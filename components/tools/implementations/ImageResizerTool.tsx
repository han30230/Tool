"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { loadImageFromFile, drawContainToCanvas, canvasToBlob } from "@/lib/image/browser";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type ImageResizerToolProps = { tool: ResolvedTool };

export function ImageResizerTool({ tool }: ImageResizerToolProps) {
  const [widthRaw, setWidthRaw] = useState("1200");
  const [heightRaw, setHeightRaw] = useState("1200");
  const [keepRatio, setKeepRatio] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outName, setOutName] = useState("resized-image.png");
  const [outSize, setOutSize] = useState<number | null>(null);

  const width = useMemo(
    () => Math.min(8000, Math.max(1, parseInt(widthRaw.replace(/\D/g, ""), 10) || 1200)),
    [widthRaw],
  );
  const height = useMemo(
    () => Math.min(8000, Math.max(1, parseInt(heightRaw.replace(/\D/g, ""), 10) || 1200)),
    [heightRaw],
  );

  const onFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 선택할 수 있습니다.");
        return;
      }
      setBusy(true);
      setError(undefined);
      setOutUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      try {
        const img = await loadImageFromFile(file);
        let w = width;
        let h = height;
        if (keepRatio) {
          const ratio = img.naturalWidth / img.naturalHeight;
          if (w / h > ratio) w = Math.max(1, Math.round(h * ratio));
          else h = Math.max(1, Math.round(w / ratio));
        }
        const canvas = drawContainToCanvas(img, w, h);
        const blob = await canvasToBlob(canvas, "image/png");
        const url = URL.createObjectURL(blob);
        setOutUrl(url);
        setOutSize(blob.size);
        const base = file.name.replace(/\.[^.]+$/, "") || "image";
        setOutName(`${base}-${w}x${h}.png`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "리사이즈에 실패했습니다.");
      } finally {
        setBusy(false);
      }
    },
    [width, height, keepRatio],
  );

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            업로드한 이미지는 브라우저 안에서만 리사이즈합니다.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="너비(px)"
              value={widthRaw}
              onChange={(e) => setWidthRaw(e.target.value)}
              inputMode="numeric"
            />
            <FormField
              label="높이(px)"
              value={heightRaw}
              onChange={(e) => setHeightRaw(e.target.value)}
              inputMode="numeric"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={keepRatio}
              onChange={(e) => setKeepRatio(e.target.checked)}
            />
            비율 유지
          </label>
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
            className="text-sm text-[var(--foreground)]"
          />
          <ToolActionBar
            onReset={() => {
              setWidthRaw("1200");
              setHeightRaw("1200");
              setKeepRatio(true);
              setOutUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
              });
              setOutSize(null);
              setError(undefined);
            }}
            onExample={() => {
              setWidthRaw("1080");
              setHeightRaw("1080");
            }}
          />
          {busy ? <p className="text-sm text-[var(--muted)]">처리 중…</p> : null}
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      }
      resultSlot={
        outUrl ? (
          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={outUrl} alt="리사이즈 결과" className="max-h-72 w-auto rounded-lg border border-[var(--border)]" />
            <p className="text-sm text-[var(--muted)]">
              결과 크기: {width} × {height}px
              {outSize !== null ? ` · ${(outSize / 1024).toFixed(1)}KB` : ""}
            </p>
            <a
              href={outUrl}
              download={outName}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              다운로드
            </a>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            이미지를 선택하면 리사이즈 결과가 나타납니다.
          </div>
        )
      }
    />
  );
}

