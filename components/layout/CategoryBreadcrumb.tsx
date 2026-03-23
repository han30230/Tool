import Link from "next/link";
import type { CategoryId } from "@/content/tools/types";
import { categories } from "@/content/tools/registry";

type CategoryBreadcrumbProps = {
  categoryId: CategoryId;
  className?: string;
};

function Chevron() {
  return (
    <span className="mx-0.5 text-[var(--border-strong)]" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline opacity-70">
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function CategoryBreadcrumb({ categoryId, className = "" }: CategoryBreadcrumbProps) {
  const cat = categories[categoryId];

  return (
    <nav aria-label="breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-0.5">
        <li>
          <Link
            href="/"
            className="rounded-md px-2 py-1 text-[var(--muted)] transition hover:bg-[var(--accent-subtle)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            홈
          </Link>
        </li>
        <Chevron />
        <li>
          <span
            className="rounded-md bg-[var(--accent-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]"
            aria-current="page"
          >
            {cat.title}
          </span>
        </li>
      </ol>
    </nav>
  );
}
