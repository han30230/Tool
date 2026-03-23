import Link from "next/link";
import type { ReactNode } from "react";

type LinkCardProps = {
  href: string;
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function LinkCard({
  href,
  title,
  description,
  footer,
  className = "",
  titleClassName = "text-lg",
}: LinkCardProps) {
  return (
    <Link
      href={href}
      className={`group relative block h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-sm)] ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:shadow-[var(--shadow-lg)] hover:ring-[var(--accent)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] sm:p-6 ${className}`}
    >
      <span
        className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-[var(--accent)]/10 to-cyan-500/5 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <span
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent opacity-0 transition group-hover:opacity-100"
        aria-hidden
      />
      <span className={`relative block font-semibold tracking-tight text-[var(--foreground)] ${titleClassName}`}>
        {title}
        <span
          className="ml-1 inline-block translate-x-0 text-[var(--accent)] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
          aria-hidden
        >
          →
        </span>
      </span>
      {description ? (
        <p className="relative mt-2.5 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
      ) : null}
      {footer ? <div className="relative mt-4">{footer}</div> : null}
    </Link>
  );
}
