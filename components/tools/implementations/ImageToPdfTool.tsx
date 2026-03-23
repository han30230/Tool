"use client";

import { PDFDocument } from "pdf-lib";
import { useCallback, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";

type ImageToPdfToolProps = { tool: ResolvedTool };

export function ImageToPdfTool({ tool }: ImageToPdfToolProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(undefined);
    setMessage(undefined);
    try {
      const pdf = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (!file) continue;
        if (!file.type.startsWith("image/")) continue;
        const bytes = new Uint8Array(await file.arrayBuffer());
        let image;
        if (file.type.includes("png")) image = await pdf.embedPng(bytes);
        else image = await pdf.embedJpg(bytes);
        const { width, height } = image.scale(1);
        const page = pdf.addPage([width, height]);
        page.drawImage(image, { x: 0, y: 0, width, height });
      }
      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setMessage(`${files.length}개 이미지를 PDF로 변환했습니다.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지→PDF 변환에 실패했습니다.");
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
            이미지는 브라우저에서만 처리됩니다. JPG/PNG를 권장합니다.
          </p>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            disabled={busy}
            onChange={(e) => void onFiles(e.target.files)}
            className="text-sm text-[var(--foreground)]"
          />
          {busy ? <p className="text-sm text-[var(--muted)]">처리 중…</p> : null}
          {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      }
      resultSlot={
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-inner)] p-4 text-sm text-[var(--muted)]">
          여러 이미지를 선택하면 선택한 순서대로 하나의 PDF로 저장합니다.
        </div>
      }
    />
  );
}

