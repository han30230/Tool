import Link from "next/link";
import { categories, tools } from "@/content/tools/registry";
import { buildCategoryMetadata } from "@/lib/seo/metadata";
import { AdSlot } from "@/components/ads/AdSlot";
import { PageContainer, Section, LinkCard, Card } from "@/components/ui";

export const metadata = buildCategoryMetadata(
  "툴모음 — 계산·단위·텍스트·유틸리티",
  "부가세·급여·대출·BMI·D-day부터 비밀번호·난수·URL·Base64까지. 회원가입 없이 브라우저에서 바로 쓰고, 입력값은 서버에 남지 않습니다.",
  "/",
);

const popular = [
  "vat",
  "percent",
  "take-home-pay",
  "loan",
  "bmi",
  "password-generator",
  "salary",
  "date",
  "char-count",
  "base64",
];

const categoryAccent: Record<string, string> = {
  calculator: "🧮",
  convert: "📐",
  text: "📝",
  utility: "⚡",
};

export default function HomePage() {
  const featured = tools.filter((t) => popular.includes(t.slug));
  const toolCount = tools.length;
  const categoryCount = Object.keys(categories).length;

  return (
    <PageContainer wide>
      <section
        className="surface-hero hero-mesh relative overflow-hidden p-6 sm:p-10 lg:p-12"
        aria-labelledby="home-hero-heading"
      >
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/30 via-violet-400/20 to-cyan-400/15 blur-3xl animate-hero-glow dark:from-indigo-500/25 dark:via-violet-500/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-violet-500/15 to-transparent blur-3xl dark:from-violet-400/20"
          aria-hidden
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-inner)]/80 px-3 py-1 text-xs font-semibold text-[var(--foreground)] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              무료 · 로그인 없음 · 로컬 처리
            </p>
            <span className="rounded-full bg-[var(--accent-subtle)] px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-[var(--accent)]">
              {toolCount}+ tools
            </span>
          </div>
          <h1
            id="home-hero-heading"
            className="mt-6 text-balance-safe text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl sm:leading-[1.1]"
          >
            숫자·급여·텍스트,
            <br className="sm:hidden" />{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-300 dark:to-cyan-300">
              한 화면에 정리
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            견적·쇼핑·이직·코딩까지 자주 쓰는 계산과 변환을 모았습니다. 설치 없이 브라우저에서 바로
            실행하고, 입력 내용은 서버에 보내지 않습니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/c/calculator"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
            >
              계산 도구 보기
            </Link>
            <Link
              href="#categories"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)]/30 hover:bg-[var(--card-inner)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            >
              카테고리 둘러보기
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-8 sm:max-w-lg sm:gap-4">
            <div className="text-center sm:text-left">
              <dt className="text-[0.7rem] font-medium uppercase tracking-wider text-[var(--muted)]">
                도구
              </dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-[var(--foreground)] sm:text-3xl">
                {toolCount}
              </dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="text-[0.7rem] font-medium uppercase tracking-wider text-[var(--muted)]">
                카테고리
              </dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-[var(--foreground)] sm:text-3xl">
                {categoryCount}
              </dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="text-[0.7rem] font-medium uppercase tracking-wider text-[var(--muted)]">
                가격
              </dt>
              <dd className="mt-1 text-2xl font-bold text-[var(--foreground)] sm:text-3xl">0원</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mt-10">
        <AdSlot variant="home" />
      </div>

      <Section
        id="categories"
        title="카테고리별로 보기"
        description="원하는 유형만 골라 들어가면 비슷한 도구를 한꺼번에 볼 수 있습니다."
        className="mt-14"
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(categories).map(([id, c]) => (
            <li key={id}>
              <LinkCard
                href={c.path}
                title={c.title}
                description={c.description}
                titleClassName="text-lg"
                footer={
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent)]">
                    <span className="text-base" aria-hidden>
                      {categoryAccent[id] ?? "✨"}
                    </span>
                    둘러보기
                  </span>
                }
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="popular"
        title="처음 써 보기 좋은 도구"
        description="자주 찾는 기능부터 모아 두었습니다. 각 페이지에 사용법·기준·FAQ가 있습니다."
        className="mt-16"
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

      <Section id="trust" title="이 사이트를 쓸 때" className="mt-16">
        <Card className="border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--card-inner)]/50">
          <ul className="list-inside list-disc space-y-3 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--accent)]">
            <li>무료이며 회원가입이 필요 없습니다.</li>
            <li>입력값은 가능한 한 기기 안에서만 처리합니다(서버 저장을 원칙적으로 하지 않습니다).</li>
            <li>
              세무·노동·법적 판단은 참고용입니다. 중요한 결정은{" "}
              <Link href="/p/disclaimer" className="font-medium text-[var(--accent)] underline underline-offset-2">
                면책 고지
              </Link>
              와 전문가 상담을 함께 확인해 주세요.
            </li>
            <li>
              소개·문의는{" "}
              <Link href="/about" className="font-medium text-[var(--accent)] underline underline-offset-2">
                소개
              </Link>
              ,{" "}
              <Link href="/contact" className="font-medium text-[var(--accent)] underline underline-offset-2">
                문의
              </Link>
              를 이용해 주세요.
            </li>
          </ul>
        </Card>
      </Section>
    </PageContainer>
  );
}
