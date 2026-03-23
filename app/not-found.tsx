import Link from "next/link";
import { PageContainer } from "@/components/ui/PageContainer";

export default function NotFound() {
  return (
    <PageContainer className="py-16 sm:py-24">
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">404</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          주소가 바뀌었거나 존재하지 않는 페이지입니다.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] dark:from-indigo-500 dark:to-violet-500"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </PageContainer>
  );
}
