import type { FaqItem } from "@/content/tools/types";

type FAQSectionProps = {
  items: FaqItem[];
  title?: string;
  id?: string;
  className?: string;
};

export function FAQSection({
  items,
  title = "자주 묻는 질문",
  id = "faq",
  className = "",
}: FAQSectionProps) {
  const headingId = `${id}-heading`;

  if (items.length === 0) return null;

  return (
    <section className={className} aria-labelledby={headingId}>
      <div className="flex items-start gap-3">
        <span
          className="mt-1.5 h-7 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 shadow-sm shadow-indigo-500/30"
          aria-hidden
        />
        <h2 id={headingId} className="text-xl font-bold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
      </div>
      <ul className="mt-6 space-y-3 sm:pl-4">
        {items.map((f) => (
          <li
            key={f.question}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] sm:p-5"
          >
            <p className="font-semibold text-[var(--foreground)]">{f.question}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
