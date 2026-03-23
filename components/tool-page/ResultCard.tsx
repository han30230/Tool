"use client";

import { useCallback, useState } from "react";

export type ResultExtraRow = {
  label: string;
  value: string;
};

type ResultCardProps = {
  primaryLabel?: string;
  primaryValue: string;
  copyText?: string;
  description?: string;
  extraRows?: ResultExtraRow[];
  className?: string;
};

export function ResultCard({
  primaryLabel = "결과",
  primaryValue,
  copyText,
  description,
  extraRows,
  className = "",
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const textToCopy = copyText ?? primaryValue;

  const handleCopy = useCallback(async () => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [textToCopy]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-glow)] ${className}`}
      role="region"
      aria-label="계산 결과"
    >
      <div
        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 via-violet-500 to-cyan-500"
        aria-hidden
      />
      <div className="p-5 pl-6 sm:p-6 sm:pl-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              {primaryLabel}
            </p>
            <p className="mt-2 break-words bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-2xl font-bold tabular-nums tracking-tight text-transparent dark:from-indigo-400 dark:to-violet-300 sm:text-3xl">
              {primaryValue}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] min-h-[44px] min-w-[72px] dark:from-indigo-500 dark:to-violet-500"
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
        {description ? (
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
        ) : null}
        {extraRows && extraRows.length > 0 ? (
          <dl className="mt-5 grid gap-3 border-t border-[var(--border)] pt-5 text-sm sm:grid-cols-2">
            {extraRows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl bg-[var(--card-inner)] px-3 py-2.5"
              >
                <dt className="text-xs font-medium text-[var(--muted)]">{row.label}</dt>
                <dd className="mt-0.5 font-semibold tabular-nums text-[var(--foreground)]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  );
}
