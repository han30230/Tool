import type { CategoryId, FaqItem, ResolvedTool } from "@/content/tools/types";
import { categories } from "@/content/tools/registry";
import { getSiteUrl } from "./site";

const CTX = "https://schema.org";

/**
 * 브라우저에서 동작하는 무료 유틸리티 도구.
 * Schema.org의 WebApplication(소프트웨어 응용의 한 유형)으로 표현합니다.
 */
export function buildWebApplicationJsonLd(tool: ResolvedTool) {
  const base = getSiteUrl();
  const url = `${base}/tools/${tool.slug}`;
  const desc = tool.ogDescription ?? tool.metaDescription;
  return {
    "@context": CTX,
    "@type": "WebApplication",
    name: tool.title,
    description: desc,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. HTML5 브라우저.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    inLanguage: "ko-KR",
    ...(tool.keywords.length > 0 ? { keywords: tool.keywords.join(", ") } : {}),
  };
}

/** FAQ 항목이 있을 때만 사용. 빈 배열이면 null */
export function buildFaqPageJsonLd(faq: FaqItem[]) {
  if (faq.length === 0) return null;
  return {
    "@context": CTX,
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function buildBreadcrumbListJsonLd(tool: ResolvedTool) {
  const base = getSiteUrl();
  const cat = categories[tool.categoryId];
  const catUrl = `${base}${cat.path}`;
  const toolUrl = `${base}/tools/${tool.slug}`;

  return {
    "@context": CTX,
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${cat.title} 도구`,
        item: catUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: toolUrl,
      },
    ],
  };
}

/** 카테고리 목록 페이지용: 홈 → 카테고리 */
export function buildCategoryBreadcrumbJsonLd(categoryId: CategoryId) {
  const base = getSiteUrl();
  const cat = categories[categoryId];
  const catUrl = `${base}${cat.path}`;
  return {
    "@context": CTX,
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${cat.title} 도구 모음`,
        item: catUrl,
      },
    ],
  };
}

export type StructuredGraphOptions = {
  /** WebApplication 외 추가 노드 (Article 등 확장용) */
  extraNodes?: Record<string, unknown>[];
  /** FAQ 스키마 생략 */
  omitFaq?: boolean;
};

/**
 * @graph에 넣을 노드 배열. JsonLd 컴포넌트와 함께 사용.
 */
export function buildToolStructuredGraph(
  tool: ResolvedTool,
  options: StructuredGraphOptions = {},
): unknown[] {
  const nodes: unknown[] = [buildWebApplicationJsonLd(tool)];

  if (!options.omitFaq) {
    const faq = buildFaqPageJsonLd(tool.faq);
    if (faq) nodes.push(faq);
  }

  nodes.push(buildBreadcrumbListJsonLd(tool));

  if (options.extraNodes?.length) {
    nodes.push(...options.extraNodes);
  }

  return nodes;
}

/** @deprecated buildToolStructuredGraph 사용 */
export function buildToolJsonLd(tool: ResolvedTool) {
  return buildToolStructuredGraph(tool);
}
