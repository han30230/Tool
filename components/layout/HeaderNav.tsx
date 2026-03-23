"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/content/tools/registry";

const navLink =
  "rounded-full px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]";

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-0.5 md:flex" aria-label="카테고리">
      {Object.entries(categories).map(([id, c]) => {
        const active = pathname === c.path;
        return (
          <Link
            key={id}
            href={c.path}
            className={`${navLink} ${
              active
                ? "bg-[var(--accent-subtle)] text-[var(--accent)] shadow-[var(--shadow-sm)]"
                : "text-[var(--muted)] hover:bg-[var(--card-inner)] hover:text-[var(--foreground)]"
            }`}
          >
            {c.title}
          </Link>
        );
      })}
      <Link
        href="/browse"
        className={`${navLink} ${
          pathname === "/browse"
            ? "bg-[var(--accent-subtle)] text-[var(--accent)] shadow-[var(--shadow-sm)]"
            : "text-[var(--muted)] hover:bg-[var(--card-inner)] hover:text-[var(--foreground)]"
        }`}
      >
        전체
      </Link>
      <span className="mx-1 hidden h-5 w-px bg-[var(--border-strong)] lg:inline" aria-hidden />
      <Link
        href="/about"
        className={`${navLink} hidden text-[var(--muted)] hover:text-[var(--foreground)] lg:inline-flex`}
      >
        소개
      </Link>
    </nav>
  );
}
