"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { loadImageFromFile, drawContainToCanvas, canvasToBlob } from "@/lib/image/browser";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type OutputType = "jpeg" | "png" | "webp";

const MIME: Record<OutputType, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

type ImageFormatConverterToolProps = { tool: ResolvedTool };

export function ImageFormatConverterTool({ tool }: ImageFormatConverterToolProps) {
  const [type, setType] = useState<OutputType>("webp");
  const [qualityRaw, setQualityRaw] = useState("0.9");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outName, setOutName] = useState("converted-image.webp");
  const [outSize, setOutSize] = useState<number | null>(null);
  const quality = useMemo(
    () => Math.min(1, Math.max(0.1, parseFloat(qualityRaw.replace(",", ".")) || 0.9)),
    [qualityRaw],
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
        const canvas = drawContainToCanvas(img, img.naturalWidth, img.naturalHeight);
        const blob = await canvasToBlob(canvas, MIME[type], type === "png" ? undefined : quality);
        const base = file.name.replace(/\.[^.]+$/, "") || "image";
        const url = URL.createObjectURL(blob);
        setOutUrl(url);
        setOutSize(blob.size);
        setOutName(`${base}.${type === "jpeg" ? "jpg" : type}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "포맷 변환에 실패했습니다.");
      } finally {
        setBusy(false);
      }
    },
    [type, quality],
  );

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">브라우저 안에서만 이미지 포맷을 변환합니다.</p>
          <div className="flex flex-wrap gap-2">
            {(["jpeg", "png", "webp"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                  type === t
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <FormField
            label="품질 (JPEG/WEBP, 0.1–1)"
            value={qualityRaw}
            onChange={(e) => setQualityRaw(e.target.value)}
            inputMode="decimal"
          />
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
              setType("webp");
              setQualityRaw("0.9");
              setError(undefined);
              setOutSize(null);
              setOutUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
              });
            }}
            onExample={() => {
              setType("jpeg");
              setQualityRaw("0.8");
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
            <img src={outUrl} alt="포맷 변환 결과" className="max-h-72 w-auto rounded-lg border border-[var(--border)]" />
            <p className="text-sm text-[var(--muted)]">
              출력 형식: {type.toUpperCase()}
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
            이미지를 선택하면 변환 결과가 나타납니다.
          </div>
        )
      }
    />
  );
}

