import Link from "next/link";
import { categories, tools } from "@/content/tools/registry";
import { buildCategoryMetadata } from "@/lib/seo/metadata";
import { AdSlot } from "@/components/ads/AdSlot";
import { PageContainer, Section, LinkCard, Card } from "@/components/ui";

export const metadata = buildCategoryMetadata(
  "툴모음 — 계산·단위·텍스트 도구",
  "부가세·퍼센트·할인·마진·연봉 환산·날짜·평·㎡, 글자 수·줄바꿈 정리·JSON까지. 회원가입 없이 브라우저에서 바로 쓰고, 입력값은 서버에 남지 않습니다.",
  "/",
);

const popular = ["vat", "percent", "discount", "salary", "date", "char-count"];

export default function HomePage() {
  const featured = tools.filter((t) => popular.includes(t.slug));

  return (
    <PageContainer>
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-lg)] sm:p-10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-400/25 to-cyan-400/10 blur-3xl"
          aria-hidden
        />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-violet-500/10 to-transparent blur-2xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-subtle)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
            무료 · 로그인 없음 · 브라우저에서만 처리
          </p>
          <h1 className="mt-5 text-balance-safe text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl sm:leading-tight">
            견적·쇼핑·글쓰기까지,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">
              숫자와 텍스트
            </span>
            를 여기서 정리하세요
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            영수증 금액, 할인율, 급여 협상, 일정, 부동산 면적, 글자 수 제한, 붙여 넣은 JSON까지—자주 하는 계산을 한곳에 모았습니다. 설치나 로그인 없이 브라우저에서 바로 동작하고, 입력 내용은 서버에 저장하지 않습니다.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <AdSlot variant="home" />
      </div>

      <Section
        id="categories"
        title="카테고리별로 보기"
        description="필요한 유형만 골라 들어가도 됩니다. 각 카테고리 페이지에서 비슷한 도구를 한꺼번에 볼 수 있습니다."
        className="mt-12"
      >
        <ul className="grid gap-4 sm:grid-cols-3">
          {Object.entries(categories).map(([id, c]) => (
            <li key={id} className="min-h-[120px]">
              <LinkCard
                href={c.path}
                title={c.title}
                description={c.description}
                titleClassName="text-lg"
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="popular"
        title="처음 써 보기 좋은 도구"
        description="많이 찾는 순서로 골라 두었습니다. 각 페이지마다 쓰는 법·계산 기준·자주 묻는 질문을 적어 두었으니, 처음 오셔도 바로 따라가실 수 있습니다."
        className="mt-14"
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {featured.map((t) => (
            <li key={t.slug}>
              <LinkCard
                href={`/tools/${t.slug}`}
                title={t.title}
                description={t.description}
                titleClassName="text-base"
              />
            </li>
          ))}
        </ul>
      </Section>

      <div className="mt-14">
        <AdSlot variant="inline" />
      </div>

      <Section id="trust" title="이 사이트를 쓸 때" className="mt-14">
        <Card>
          <ul className="list-inside list-disc space-y-3 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--accent)]">
            <li>무료이며 회원가입이 필요 없습니다.</li>
            <li>도구에 입력한 값은 가능한 한 기기 안에서만 처리합니다(서버 저장을 원칙적으로 하지 않습니다).</li>
            <li>
              세무·노동·법적 면적 등은 참고용입니다. 중요한 결정은{" "}
              <Link href="/p/disclaimer" className="font-medium text-[var(--accent)] underline underline-offset-2">
                면책 고지
              </Link>
              와 전문가 상담을 함께 확인해 주세요.
            </li>
            <li>
              사이트 소개는{" "}
              <Link href="/about" className="font-medium text-[var(--accent)] underline underline-offset-2">
                소개
              </Link>{" "}
              페이지를 참고하세요.
            </li>
          </ul>
        </Card>
      </Section>
    </PageContainer>
  );
}
