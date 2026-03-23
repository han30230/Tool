"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type HTMLInputTypeAttribute,
} from "react";

export type FormFieldProps = {
  label: string;
  helperText?: string;
  error?: string;
  /** input id (없으면 useId) */
  id?: string;
  className?: string;
  /** input 요소에 전달 */
  inputClassName?: string;
  type?: HTMLInputTypeAttribute;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  /** 숫자·소수 입력 등 */
  step?: string | number;
  min?: string | number;
  max?: string | number;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  onBlur?: InputHTMLAttributes<HTMLInputElement>["onBlur"];
};

const baseInput =
  "w-full min-h-[48px] rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-base text-[var(--foreground)] shadow-[var(--shadow-sm)] outline-none transition placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)]/40 focus:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] disabled:cursor-not-allowed disabled:opacity-60";

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField(
    {
      label,
      helperText,
      error,
      id: idProp,
      className = "",
      inputClassName = "",
      type = "text",
      ...rest
    },
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
        <input
          ref={ref}
          id={id}
          type={type}
          className={`${baseInput} ${error ? "border-red-500/80" : ""} ${inputClassName}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
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
