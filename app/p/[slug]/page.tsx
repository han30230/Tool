import { notFound } from "next/navigation";
import { getPolicySlugs, policies } from "@/content/policies";
import { buildPolicyMetadata } from "@/lib/seo/metadata";
import { PageContainer } from "@/components/ui/PageContainer";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPolicySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = policies[slug];
  if (!p) return {};
  return buildPolicyMetadata(p.title, p.description, `/p/${slug}`);
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  const p = policies[slug];
  if (!p) notFound();

  return (
    <PageContainer>
      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-lg)] sm:p-8">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-slate-400/10 to-transparent blur-2xl"
          aria-hidden
        />
        <h1 className="relative text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {p.title}
        </h1>
        <p className="relative mt-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          최종 수정 {new Date().toISOString().slice(0, 10)}
        </p>
      </header>
      <div
        className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--muted)] [&_h2]:mt-10 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_p]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: p.html }}
      />
    </PageContainer>
  );
}
