"use client";

import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { useCallback, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";

type PdfMergeSplitToolProps = { tool: ResolvedTool };

export function PdfMergeSplitTool({ tool }: PdfMergeSplitToolProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [mergeMsg, setMergeMsg] = useState<string | undefined>();
  const [splitMsg, setSplitMsg] = useState<string | undefined>();

  const mergePdfs = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(undefined);
    setMergeMsg(undefined);
    try {
      const out = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const f = files.item(i);
        if (!f) continue;
        const bytes = await f.arrayBuffer();
        const src = await PDFDocument.load(bytes, { ignoreEncryption: false });
        const idx = src.getPageIndices();
        const copied = await out.copyPages(src, idx);
        copied.forEach((p) => out.addPage(p));
      }
      const buf = await out.save();
      const blob = new Blob([new Uint8Array(buf)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setMergeMsg(`${files.length}개 파일을 합쳤습니다.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "병합에 실패했습니다. 암호·손상 파일일 수 있습니다.");
    } finally {
      setBusy(false);
    }
  }, []);

  const splitPdf = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(undefined);
    setSplitMsg(undefined);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const n = src.getPageCount();
      if (n > 80) {
        setError("페이지가 너무 많습니다. 80페이지 이하로 나눠 주세요.");
        setBusy(false);
        return;
      }
      const zip = new JSZip();
      for (let i = 0; i < n; i++) {
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        const pdfBytes = await out.save();
        zip.file(`page-${String(i + 1).padStart(3, "0")}.pdf`, pdfBytes);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pages.zip";
      a.click();
      URL.revokeObjectURL(url);
      setSplitMsg(`${n}페이지를 ZIP에 담았습니다.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "분할에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-10">
          <p className="text-xs text-[var(--muted)]">
            PDF는 브라우저 메모리에서만 처리합니다. 서버로 보내지 않습니다. 큰 파일은 실패할 수 있습니다.
          </p>
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--foreground)]">병합</h2>
            <p className="text-sm text-[var(--muted)]">여러 PDF를 선택한 순서대로 한 파일로 합칩니다.</p>
            <input
              type="file"
              accept="application/pdf"
              multiple
              disabled={busy}
              onChange={(e) => void mergePdfs(e.target.files)}
              className="text-sm text-[var(--foreground)]"
            />
            {mergeMsg ? <p className="text-sm text-[var(--muted)]">{mergeMsg}</p> : null}
          </section>
          <section className="space-y-3 border-t border-[var(--border)] pt-8">
            <h2 className="text-base font-bold text-[var(--foreground)]">페이지별 분할 (ZIP)</h2>
            <p className="text-sm text-[var(--muted)]">한 PDF의 각 페이지를 개별 PDF로 만들어 ZIP으로 받습니다.</p>
            <input
              type="file"
              accept="application/pdf"
              disabled={busy}
              onChange={(e) => void splitPdf(e.target.files?.[0])}
              className="text-sm text-[var(--foreground)]"
            />
            {splitMsg ? <p className="text-sm text-[var(--muted)]">{splitMsg}</p> : null}
          </section>
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {busy ? <p className="text-sm text-[var(--muted)]">처리 중…</p> : null}
        </div>
      }
      resultSlot={
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-inner)] p-4 text-sm text-[var(--muted)]">
          병합 결과는 merged.pdf, 분할은 pages.zip으로 저장됩니다.
        </div>
      }
    />
  );
}
