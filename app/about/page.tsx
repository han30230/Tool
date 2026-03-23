import Link from "next/link";
import { buildPolicyMetadata } from "@/lib/seo/metadata";
import { PageContainer } from "@/components/ui/PageContainer";

export const metadata = buildPolicyMetadata(
  "소개",
  "툴모음 서비스 목적과 운영 방침을 안내합니다.",
  "/about",
);

export default function AboutPage() {
  return (
    <PageContainer>
      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-lg)] sm:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-400/15 to-transparent blur-2xl"
          aria-hidden
        />
        <h1 className="relative text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          소개
        </h1>
      </header>
      <div className="mt-10 space-y-5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
        <p>
          툴모음은 한국어 사용자를 위한{" "}
          <strong className="font-semibold text-[var(--foreground)]">무료 온라인 계산·변환 도구</strong>를
          제공합니다. 회원가입 없이 브라우저에서 바로 사용할 수 있도록 설계했습니다.
        </p>
        <p>
          계산과 텍스트 처리는 가능한 한{" "}
          <strong className="font-semibold text-[var(--foreground)]">기기 안(클라이언트)</strong>에서
          이루어지며, 서버에 입력 내용을 저장하지 않는 것을 원칙으로 합니다.
        </p>
        <p>
          세무·급여 등은 참고용이며, 자세한 내용은{" "}
          <Link
            href="/p/disclaimer"
            className="font-medium text-[var(--accent)] underline underline-offset-2 transition hover:text-[var(--accent-hover)]"
          >
            면책 고지
          </Link>
          를 확인해 주세요.
        </p>
      </div>
    </PageContainer>
  );
}
