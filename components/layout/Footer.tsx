import Link from "next/link";
import { categories } from "@/content/tools/registry";
import { PageContainer } from "@/components/ui/PageContainer";

const linkClass =
  "text-[var(--muted)] transition hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] rounded-sm";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm">
      <PageContainer variant="footer">
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
        <p className="mt-12 border-t border-[var(--border)] pt-8 text-center text-xs text-[var(--muted)]">
          © {year}{" "}
          <span className="font-medium text-[var(--foreground)]">툴모음</span>. 참고용 도구입니다.
        </p>
      </PageContainer>
    </footer>
  );
}
