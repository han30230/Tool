"use client";

import { forwardRef, useId } from "react";
import type { TextareaHTMLAttributes } from "react";

export type FormTextareaProps = {
  label: string;
  helperText?: string;
  error?: string;
  id?: string;
  className?: string;
  textareaClassName?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;

const base =
  "w-full min-h-[160px] rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-base text-[var(--foreground)] shadow-[var(--shadow-sm)] outline-none transition placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)]/40 focus:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] disabled:cursor-not-allowed disabled:opacity-60";

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea(
    { label, helperText, error, id: idProp, className = "", textareaClassName = "", ...rest },
    ref,
  ) {
    const uid = useId();
    const id = idProp ?? uid;
    const helperId = helperText ? `${id}-helper` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={className}>
        <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          className={`${base} ${error ? "border-red-500/80" : ""} ${textareaClassName}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          spellCheck={rest.spellCheck ?? false}
          {...rest}
        />
        {helperText && !error ? (
          <p id={helperId} className="mt-1 text-xs text-[var(--muted)]">
            {helperText}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
