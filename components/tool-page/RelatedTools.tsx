import Link from "next/link";
import type { ResolvedTool } from "@/content/tools/types";
import { categories, getToolBySlug, tools } from "@/content/tools/registry";
import { getRecommendedTools } from "@/lib/tools/recommendations";

type RelatedToolsProps = {
  tool: ResolvedTool;
  className?: string;
};

const linkPill =
  "inline-flex items-center gap-1 rounded-full bg-[var(--accent-subtle)] px-3 py-1 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

export function RelatedTools({ tool, className = "" }: RelatedToolsProps) {
  const relatedSet = new Set<string>([tool.slug, ...tool.relatedSlugs]);
  const smartPicks = getRecommendedTools(tool, tools, 10).filter((t) => !relatedSet.has(t.slug)).slice(0, 6);

  return (
    <nav className={className} aria-label="관련 도구">
      <div className="flex items-start gap-3">
        <span
          className="mt-1.5 h-7 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 shadow-sm shadow-indigo-500/30"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">관련 도구</h2>
          {tool.relatedIntro ? (
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{tool.relatedIntro}</p>
          ) : null}
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--muted)]">
            <Link href="/" className={linkPill}>
              홈
            </Link>
            <span className="text-[var(--border-strong)]" aria-hidden>
              ·
            </span>
            <Link href={categories[tool.categoryId].path} className={linkPill}>
              {categories[tool.categoryId].title} 모음
            </Link>
            <span className="text-[var(--muted)]">에서 비슷한 도구를 볼 수 있어요.</span>
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {tool.relatedSlugs.map((slug) => {
              const related = getToolBySlug(slug);
              if (!related) return null;
              return (
                <li key={slug}>
                  <Link
                    href={`/tools/${slug}`}
                    className="group flex min-h-[52px] items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)]/30 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
                  >
                    <span>
                      <span className="text-[var(--accent)]">{related.shortTitle}</span>
                      <span className="text-[var(--muted)]"> — </span>
                      {related.title}
                    </span>
                    <span
                      className="text-[var(--accent)] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {smartPicks.length > 0 ? (
            <>
              <h3 className="mt-10 text-base font-bold text-[var(--foreground)]">
                태그·사용 맥락이 비슷한 도구
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                같은 카테고리·겹치는 태그·자주 이어서 쓰는 조합을 참고해 골랐습니다.{" "}
                <Link href="/browse" className="font-medium text-[var(--accent)] underline underline-offset-2">
                  전체 목록
                </Link>
                에서 더 찾을 수 있어요.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {smartPicks.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="group flex min-h-[48px] items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-inner)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                    >
                      <span>
                        {t.isNew ? (
                          <span className="mr-2 rounded-md bg-[var(--accent-subtle)] px-1.5 py-0.5 text-[0.65rem] font-bold uppercase text-[var(--accent)]">
                            New
                          </span>
                        ) : null}
                        <span className="text-[var(--accent)]">{t.shortTitle}</span>
                        <span className="text-[var(--muted)]"> — </span>
                        {t.title}
                      </span>
                      <span className="text-[var(--accent)] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden>
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
