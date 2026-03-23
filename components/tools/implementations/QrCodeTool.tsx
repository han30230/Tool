"use client";

import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const SIZES = [128, 192, 256, 320, 400, 512] as const;

type QrCodeToolProps = { tool: ResolvedTool };

export function QrCodeTool({ tool }: QrCodeToolProps) {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState<number>(256);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const t = text.trim();
    if (!t) {
      setDataUrl("");
      setError(undefined);
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(t, {
      width: size,
      margin: 2,
      color: { dark: "#111827", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setError(undefined);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDataUrl("");
          setError("내용이 너무 길거나 생성할 수 없습니다. 짧게 나누어 보세요.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [text, size]);

  const downloadPng = useCallback(() => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  }, [dataUrl]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            입력 내용은 브라우저에서만 QR 이미지로 바뀌며 서버로 전송되지 않습니다.
          </p>
          <FormField
            label="텍스트 또는 URL"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https:// 또는 짧은 문장"
          />
          <div>
            <label htmlFor="qr-size" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
              크기 (px)
            </label>
            <select
              id="qr-size"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full min-h-[48px] rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-base text-[var(--foreground)] shadow-[var(--shadow-sm)] outline-none focus:border-[var(--accent)]/40 focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={downloadPng}
            disabled={!dataUrl}
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)]/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            PNG로 저장
          </button>
          <ToolActionBar
            onReset={() => setText("")}
            onExample={() => setText("https://example.com")}
          />
        </div>
      }
      resultSlot={
        <div className="space-y-3">
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {dataUrl ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt="생성된 QR 코드"
                width={size}
                height={size}
                className="max-h-[min(80vw,512px)] max-w-full bg-white p-2"
              />
              <p className="text-center text-xs text-[var(--muted)]">
                스캔 테스트는 휴대폰 카메라로 확인해 보세요.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
              내용을 입력하면 미리보기가 나타납니다.
            </div>
          )}
        </div>
      }
    />
  );
}
