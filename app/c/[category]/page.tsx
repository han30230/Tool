import Link from "next/link";
import { notFound } from "next/navigation";
import type { CategoryId } from "@/content/tools/types";
import { categories, getToolsByCategory } from "@/content/tools/registry";
import { buildCategoryMetadata } from "@/lib/seo/metadata";
import { buildCategoryBreadcrumbJsonLd } from "@/lib/seo/structured";
import { CategoryBreadcrumb } from "@/components/layout/CategoryBreadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageContainer, Section, LinkCard } from "@/components/ui";

const categoryIds = Object.keys(categories) as CategoryId[];

export function generateStaticParams() {
  return categoryIds.map((category) => ({ category }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const c = categories[category as CategoryId];
  if (!c) return {};
  return buildCategoryMetadata(
    `${c.title} 도구 모음`,
    `${c.description} 전체 목록은 이 페이지에서 한눈에 보고, 각 툴 페이지에서 쓰는 법과 자주 묻는 질문을 확인할 수 있습니다.`,
    `/c/${category}`,
  );
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const meta = categories[category as CategoryId];
  if (!meta) notFound();

  const list = getToolsByCategory(category as CategoryId);
  const buddy = list.slice(0, 3);
  const jsonLd = [buildCategoryBreadcrumbJsonLd(category as CategoryId)];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageContainer>
        <CategoryBreadcrumb categoryId={category as CategoryId} className="mb-8" />
        <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-lg)] sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-400/15 to-cyan-400/10 blur-2xl"
            aria-hidden
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              카테고리
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {meta.title} 도구
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              {meta.description}
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              <Link
                href="/"
                className="font-medium text-[var(--accent)] underline underline-offset-2 transition hover:text-[var(--accent-hover)]"
              >
                홈
              </Link>
              에서 다른 카테고리와 추천 도구도 볼 수 있습니다.{" "}
              <Link
                href={`/browse?cat=${category}`}
                className="font-medium text-[var(--accent)] underline underline-offset-2 transition hover:text-[var(--accent-hover)]"
              >
                이 카테고리만 검색·정렬로 보기
              </Link>
            </p>
          </div>
        </header>

      {buddy.length > 0 && (
        <Section
          id="buddy"
          title="같이 쓰기 좋은 도구"
          className="mt-10"
          description="같은 카테고리 안에서 입력 방식이 비슷하거나, 앞뒤로 이어서 쓰기 좋은 도구입니다."
        >
          <ul className="flex flex-wrap gap-2">
            {buddy.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {t.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        id="tools"
        title="도구 전체"
        description="각 이름을 누르면 해당 도구만의 설명·사용법·FAQ로 이동합니다."
        className="mt-10"
      >
        <ul className="grid gap-4">
          {list.map((t) => (
            <li key={t.slug}>
              <LinkCard
                href={`/tools/${t.slug}`}
                title={t.title}
                description={t.description}
                footer={
                  <span className="text-sm font-medium text-[var(--accent)]">열기 →</span>
                }
              />
            </li>
          ))}
        </ul>
      </Section>
      </PageContainer>
    </>
  );
}
