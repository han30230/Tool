import type { ReactNode } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { PageContainer } from "@/components/ui/PageContainer";
import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumb } from "./Breadcrumb";
import { FAQSection } from "./FAQSection";
import { RelatedTools } from "./RelatedTools";

export type ToolPageLayoutProps = {
  tool: ResolvedTool;
  inputSlot: ReactNode;
  resultSlot: ReactNode;
  showTopAd?: boolean;
  showBetweenAd?: boolean;
  showMidGuideAd?: boolean;
  showInlineAd?: boolean;
  showFooterAd?: boolean;
  showBelowRelatedAd?: boolean;
  usageSlot?: ReactNode;
  className?: string;
};

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-6 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 shadow-sm shadow-indigo-500/30"
        aria-hidden
      />
      <h2 id={id} className="text-lg font-bold tracking-tight text-[var(--foreground)]">
        {children}
      </h2>
    </div>
  );
}

const defaultUsage = (
  <section aria-labelledby="tool-usage-fallback-heading" className="mt-10">
    <SectionHeading id="tool-usage-fallback-heading">사용 방법</SectionHeading>
    <details className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]">
      <summary className="cursor-pointer px-4 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--card-inner)]">
        빠른 안내
      </summary>
      <p className="border-t border-[var(--border)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]">
        값을 입력하면 브라우저에서 즉시 계산됩니다. 입력 내용은 서버에 저장하지 않습니다.
      </p>
    </details>
  </section>
);

function ToolGuideSections({
  sections,
  midAdSlot,
}: {
  sections: { title: string; content: string }[];
  midAdSlot?: ReactNode;
}) {
  const mid = Math.max(1, Math.ceil(sections.length / 2));
  const first = sections.slice(0, mid);
  const second = sections.slice(mid);

  return (
    <section className="mt-10" aria-labelledby="tool-guide-heading">
      <h2 id="tool-guide-heading" className="sr-only">
        도구 안내
      </h2>
      <div className="flex items-start gap-3">
        <span
          className="mt-1.5 h-7 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 shadow-sm shadow-indigo-500/30"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold tracking-tight text-[var(--foreground)]">도구 안내</p>
          <div className="mt-6 space-y-8">
            {first.map((s) => (
              <div key={s.title}>
                <h3 className="text-base font-bold text-[var(--foreground)]">{s.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
                  {s.content}
                </p>
              </div>
            ))}
          </div>
          {midAdSlot ? <div className="mt-10">{midAdSlot}</div> : null}
          {second.length > 0 ? (
            <div className="mt-8 space-y-8">
              {second.map((s) => (
                <div key={s.title}>
                  <h3 className="text-base font-bold text-[var(--foreground)]">{s.title}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
                    {s.content}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function ToolPageLayout({
  tool,
  inputSlot,
  resultSlot,
  showTopAd = true,
  showBetweenAd = false,
  showMidGuideAd = true,
  showInlineAd = true,
  showFooterAd = false,
  showBelowRelatedAd = false,
  usageSlot = defaultUsage,
  className = "",
}: ToolPageLayoutProps) {
  const midGuide =
    tool.toolSections.length > 0 && showMidGuideAd ? (
      <AdSlot variant="midGuide" />
    ) : undefined;

  return (
    <article className={className}>
      <PageContainer>
        <Breadcrumb tool={tool} className="mb-8" />

        <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-lg)] sm:p-8">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-500/10 blur-2xl"
            aria-hidden
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              무료 · 로그인 불필요
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
              {tool.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              {tool.introText}
            </p>
          </div>
        </header>

        {showTopAd ? (
          <div className="mt-8">
            <AdSlot variant="top" />
          </div>
        ) : null}

        <section className="mt-10" aria-labelledby="tool-input-heading">
          <SectionHeading id="tool-input-heading">입력</SectionHeading>
          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
            {inputSlot}
          </div>
        </section>

        {showBetweenAd ? (
          <div className="mt-8">
            <AdSlot variant="between" />
          </div>
        ) : null}

        <section className="mt-10" aria-labelledby="tool-result-heading">
          <SectionHeading id="tool-result-heading">결과</SectionHeading>
          <div className="mt-5">{resultSlot}</div>
        </section>

        {tool.toolSections.length > 0 ? (
          <ToolGuideSections sections={tool.toolSections} midAdSlot={midGuide} />
        ) : (
          <div className="mt-10">{usageSlot}</div>
        )}

        {tool.bodyText ? (
          <section
            className="mt-12 border-t border-[var(--border)] pt-10"
            aria-labelledby="tool-extra-heading"
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-1.5 h-7 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 shadow-sm shadow-indigo-500/30"
                aria-hidden
              />
              <div>
                <h2
                  id="tool-extra-heading"
                  className="text-lg font-bold tracking-tight text-[var(--foreground)]"
                >
                  배경과 참고
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
                  {tool.bodyText}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {showInlineAd ? (
          <div className="mt-10">
            <AdSlot variant="inline" />
          </div>
        ) : null}

        <FAQSection items={tool.faq} className="mt-12" />

        {showFooterAd ? (
          <div className="mt-10">
            <AdSlot variant="footer" />
          </div>
        ) : null}

        <RelatedTools tool={tool} className="mt-12 border-t border-[var(--border)] pt-10" />

        {showBelowRelatedAd ? (
          <div className="mt-10">
            <AdSlot variant="belowRelated" />
          </div>
        ) : null}
      </PageContainer>
    </article>
  );
}
