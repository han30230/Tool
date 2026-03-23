import type { Metadata } from "next";
import type { ResolvedTool } from "@/content/tools/types";
import { getSiteUrl } from "./site";

const defaultTitle = "실용 계산·변환 도구 모음";
const siteName = "툴모음";

export function buildRootMetadata(): Metadata {
  const base = getSiteUrl();
  return {
    metadataBase: new URL(base),
    title: {
      default: `${defaultTitle} | ${siteName}`,
      template: `%s | ${siteName}`,
    },
    description:
      "부가세·퍼센트·할인·마진·연봉 환산·날짜·평·㎡, 글자 수·줄바꿈 정리·JSON 포맷까지. 브라우저에서 바로 쓰는 무료 도구 모음. 회원가입 없이 모바일에서 동작합니다.",
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: base,
    },
  };
}

export type ToolMetadataOptions = {
  /** OG/Twitter 이미지 절대 URL (없으면 이미지 메타 생략, Twitter는 summary) */
  ogImageUrl?: string;
};

export function buildToolMetadata(
  tool: ResolvedTool,
  options: ToolMetadataOptions = {},
): Metadata {
  const base = getSiteUrl();
  const url = `${base}/tools/${tool.slug}`;
  const ogImage =
    options.ogImageUrl ?? process.env.NEXT_PUBLIC_OG_IMAGE_URL;

  const titleForTab = tool.seoTitle ?? tool.title;
  const ogTitle = tool.ogTitle ?? titleForTab;
  const ogDesc = tool.ogDescription ?? tool.metaDescription;

  const meta: Metadata = {
    title: titleForTab,
    description: tool.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url,
      type: "website",
      locale: "ko_KR",
      siteName,
      ...(ogImage ? { images: [{ url: ogImage, alt: ogTitle }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: ogTitle,
      description: ogDesc,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };

  if (tool.keywords.length > 0) {
    meta.keywords = tool.keywords;
  }

  return meta;
}

export function buildCategoryMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const base = getSiteUrl();
  const url = `${base}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      locale: "ko_KR",
      siteName,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function buildPolicyMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const base = getSiteUrl();
  const url = `${base}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, locale: "ko_KR" },
    twitter: { card: "summary", title, description },
  };
}
