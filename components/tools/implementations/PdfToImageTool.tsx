"use client";

import JSZip from "jszip";
import { useCallback, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";

type PdfToImageToolProps = { tool: ResolvedTool };

export function PdfToImageTool({ tool }: PdfToImageToolProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  const onFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(undefined);
    setMessage(undefined);
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdfjs = await import("pdfjs-dist");
      const docInit = {
        data,
        disableWorker: true,
        useWorkerFetch: false,
        isEvalSupported: false,
      } as unknown as Parameters<typeof pdfjs.getDocument>[0];
      const loadingTask = pdfjs.getDocument(docInit);
      const pdf = await loadingTask.promise;
      const pageCount = Math.min(pdf.numPages, 30);
      if (pdf.numPages > 30) {
        setMessage(`페이지가 많아 처음 30페이지만 변환합니다. (전체 ${pdf.numPages}페이지)`);
      }
      const zip = new JSZip();
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) continue;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
        if (blob) zip.file(`page-${String(i).padStart(3, "0")}.png`, blob);
      }
      const out = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(out);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pdf-pages-png.zip";
      a.click();
      URL.revokeObjectURL(url);
      setMessage((prev) =>
        prev
          ? `${prev}\n변환이 완료되었습니다.`
          : `${pageCount}페이지를 PNG ZIP으로 저장했습니다.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF→이미지 변환에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            브라우저에서 PDF를 렌더링해 PNG로 추출합니다. 큰 문서는 시간이 오래 걸릴 수 있습니다.
          </p>
          <input
            type="file"
            accept="application/pdf"
            disabled={busy}
            onChange={(e) => void onFile(e.target.files?.[0])}
            className="text-sm text-[var(--foreground)]"
          />
          {busy ? <p className="text-sm text-[var(--muted)]">처리 중…</p> : null}
          {message ? <p className="whitespace-pre-line text-sm text-[var(--muted)]">{message}</p> : null}
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      }
      resultSlot={
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-inner)] p-4 text-sm text-[var(--muted)]">
          PDF 각 페이지를 PNG로 추출해 ZIP 파일로 저장합니다.
        </div>
      }
    />
  );
}

