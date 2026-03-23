import Link from "next/link";
import { categories } from "@/content/tools/registry";
import { PageContainer } from "@/components/ui/PageContainer";

const linkClass =
  "text-[var(--muted)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] rounded-sm";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-auto border-t border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/25 to-transparent"
        aria-hidden
      />
      <PageContainer variant="footer" wide>
        <div className="mb-10 max-w-xl">
          <p className="text-sm font-semibold text-[var(--foreground)]">툴모음</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            계산·변환·텍스트 도구를 가볍게 모아 두었습니다. 광고·분석은 최소화하고, 입력은 가능한 한 기기 안에만 둡니다.
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              카테고리
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {Object.entries(categories).map(([id, c]) => (
                <li key={id}>
                  <Link href={c.path} className={linkClass}>
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              사이트
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/about" className={linkClass}>
                  소개
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  문의
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              정책
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/p/privacy" className={linkClass}>
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/p/disclaimer" className={linkClass}>
                  면책 고지
                </Link>
              </li>
              <li>
                <Link href="/p/terms" className={linkClass}>
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-[var(--border)] pt-8 text-center text-xs leading-relaxed text-[var(--muted)]">
          © {year}{" "}
          <span className="font-medium text-[var(--foreground)]">툴모음</span>. 참고용 도구입니다.{" "}
          <span className="block sm:inline">브라우저에서 바로 쓰는 무료 유틸리티 모음.</span>
        </p>
      </PageContainer>
    </footer>
  );
}
