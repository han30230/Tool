"use client";

type ToolActionBarProps = {
  onReset: () => void;
  onExample: () => void;
  exampleLabel?: string;
  resetLabel?: string;
  className?: string;
};

export function ToolActionBar({
  onReset,
  onExample,
  exampleLabel = "예시 입력",
  resetLabel = "초기화",
  className = "",
}: ToolActionBarProps) {
  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      role="toolbar"
      aria-label="입력 도구"
    >
      <button
        type="button"
        onClick={onExample}
        className="min-h-[44px] rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
      >
        {exampleLabel}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="min-h-[44px] rounded-xl border border-transparent bg-[var(--card-inner)] px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--accent-subtle)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
      >
        {resetLabel}
      </button>
    </div>
  );
}
