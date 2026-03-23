import { Suspense } from "react";
import { BrowseClient } from "@/components/browse/BrowseClient";
import { PageContainer, Section } from "@/components/ui";
import { buildCategoryMetadata } from "@/lib/seo/metadata";

export const metadata = buildCategoryMetadata(
  "전체 도구 목록 — 검색·필터·정렬",
  "이름·태그·설명으로 검색하고, 기존 6개 카테고리와 주제 허브로 좁혀 볼 수 있습니다. 인기순·가나다순·최신 추가순 정렬을 지원합니다.",
  "/browse",
);

function BrowseFallback() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted)]">
      목록을 불러오는 중…
    </div>
  );
}

export default function BrowsePage() {
  return (
    <PageContainer wide>
      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-lg)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">탐색</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
          전체 도구 목록
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          검색어는 공백으로 나눠 모두 포함하는 단어로 찾습니다. 카테고리와 주제 허브를 함께 쓰면 교집합으로 좁힐 수
          있습니다.
        </p>
      </header>

      <Section title="도구 찾기" className="mt-10" description="필터는 주소에 저장되어 공유하기 좋습니다.">
        <Suspense fallback={<BrowseFallback />}>
          <BrowseClient />
        </Suspense>
      </Section>
    </PageContainer>
  );
}
