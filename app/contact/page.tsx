import { buildPolicyMetadata } from "@/lib/seo/metadata";
import { PageContainer, Card } from "@/components/ui";

export const metadata = buildPolicyMetadata(
  "문의",
  "툴모음 서비스 문의·제휴·오류 제보 안내.",
  "/contact",
);

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "your-email@example.com";

  return (
    <PageContainer>
      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-lg)] sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-violet-400/15 to-transparent blur-2xl"
          aria-hidden
        />
        <h1 className="relative text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          문의
        </h1>
        <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          서비스 관련 문의, 오류 제보, 제휴 제안은 아래 연락처로 보내 주세요. 영업일 기준으로 순차
          확인합니다.
        </p>
      </header>

      <Card className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">이메일</p>
        <p className="mt-3 text-base">
          <a
            href={`mailto:${email}`}
            className="break-all font-medium text-[var(--accent)] underline underline-offset-2 transition hover:text-[var(--accent-hover)]"
          >
            {email}
          </a>
        </p>
        <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
          배포 후 실제 주소로 바꾸려면 환경 변수{" "}
          <code className="rounded-lg bg-[var(--card-inner)] px-2 py-0.5 font-mono text-[11px] text-[var(--foreground)]">
            NEXT_PUBLIC_CONTACT_EMAIL
          </code>
          를 설정하세요.
        </p>
      </Card>
    </PageContainer>
  );
}
