"use client";

import { useCallback, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";

const SIZES = [16, 32, 48] as const;

function cropSquareToCanvas(img: HTMLImageElement, size: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const s = Math.min(w, h);
  const sx = (w - s) / 2;
  const sy = (h - s) / 2;
  ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
  return canvas;
}

type FaviconGeneratorToolProps = { tool: ResolvedTool };

export function FaviconGeneratorTool({ tool }: FaviconGeneratorToolProps) {
  const [error, setError] = useState<string | undefined>();
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);

  const onFile = useCallback((file: File | undefined) => {
    setError(undefined);
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
    if (!file || !file.type.startsWith("image/")) {
      setError("이미지 파일을 선택해 주세요.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      void (async () => {
        try {
          const next: { size: number; url: string }[] = [];
          for (const size of SIZES) {
            const canvas = cropSquareToCanvas(img, size);
            const blob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob((b) => resolve(b), "image/png"),
            );
            if (blob) next.push({ size, url: URL.createObjectURL(blob) });
          }
          URL.revokeObjectURL(objectUrl);
          setPreviews(next);
        } catch {
          setError("이미지를 처리할 수 없습니다.");
          URL.revokeObjectURL(objectUrl);
        }
      })();
    };
    img.onerror = () => {
      setError("이미지를 읽을 수 없습니다.");
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            이미지는 브라우저에서만 처리합니다. 정사각형에 가까운 로고가 가장 잘 맞습니다.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
            className="text-sm text-[var(--foreground)]"
          />
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      }
      resultSlot={
        previews.length > 0 ? (
          <div className="space-y-4">
            <ul className="grid gap-4 sm:grid-cols-3">
              {previews.map((p) => (
                <li key={p.size} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center shadow-[var(--shadow-sm)]">
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    {p.size}×{p.size} PNG
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt="" className="mx-auto mt-2 bg-[var(--card-inner)]" width={p.size} height={p.size} />
                  <a
                    href={p.url}
                    download={`favicon-${p.size}.png`}
                    className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    저장
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            이미지를 선택하면 16·32·48px PNG로 만듭니다.
          </div>
        )
      }
    />
  );
}
