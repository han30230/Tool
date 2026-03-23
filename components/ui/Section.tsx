import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  id?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  title,
  id,
  description,
  children,
  className = "",
}: SectionProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      className={className}
      {...(headingId ? { "aria-labelledby": headingId } : {})}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="flex items-start gap-3">
          <span
            className="mt-1.5 h-7 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 shadow-sm shadow-indigo-500/30"
            aria-hidden
          />
          <h2
            {...(headingId ? { id: headingId } : {})}
            className="text-xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl"
          >
            {title}
          </h2>
        </div>
      </div>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:pl-4">
          {description}
        </p>
      ) : null}
      <div className={description ? "mt-8 sm:pl-4" : "mt-6 sm:pl-4"}>{children}</div>
    </section>
  );
}
