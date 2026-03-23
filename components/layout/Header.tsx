import Link from "next/link";
import { categories } from "@/content/tools/registry";
import { PageContainer } from "@/components/ui/PageContainer";
import { HeaderNav } from "@/components/layout/HeaderNav";
import { ToolSearch } from "@/components/layout/ToolSearch";

function LogoMark() {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20 dark:shadow-indigo-500/20"
      aria-hidden
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-95"
      >
        <path
          d="M4 7h16M4 12h10M4 17h7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M17 14l3 3-3 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)] shadow-[var(--shadow-sm)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[var(--header-bg)]">
      <PageContainer variant="header" wide className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl py-1 pr-2 outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
        >
          <LogoMark />
          <span className="text-[1.05rem] font-bold tracking-tight text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
            툴모음
          </span>
        </Link>
        <div className="order-3 w-full min-w-0 md:order-none md:mx-4 md:max-w-sm md:flex-1">
          <ToolSearch className="hidden md:block" />
          <ToolSearch className="md:hidden" compact />
        </div>
        <HeaderNav />
        <details className="relative md:hidden">
          <summary className="min-h-[44px] cursor-pointer list-none rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]">
            메뉴
          </summary>
          <div className="absolute right-0 z-50 mt-2 min-w-[13rem] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-[var(--shadow-lg)]">
            {Object.entries(categories).map(([id, c]) => (
              <Link
                key={id}
                href={c.path}
                className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent-subtle)]"
              >
                {c.title}
              </Link>
            ))}
            <Link
              href="/browse"
              className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent-subtle)]"
            >
              전체 목록
            </Link>
            <Link
              href="/about"
              className="flex min-h-[44px] items-center rounded-xl px-3 text-sm text-[var(--muted)] transition hover:bg-[var(--card-inner)]"
            >
              소개
            </Link>
            <Link
              href="/contact"
              className="flex min-h-[44px] items-center rounded-xl px-3 text-sm text-[var(--muted)] transition hover:bg-[var(--card-inner)]"
            >
              문의
            </Link>
            <Link
              href="/p/privacy"
              className="flex min-h-[44px] items-center rounded-xl px-3 text-sm text-[var(--muted)] transition hover:bg-[var(--card-inner)]"
            >
              개인정보처리방침
            </Link>
          </div>
        </details>
      </PageContainer>
    </header>
  );
}
