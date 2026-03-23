export type CategoryId = "calculator" | "convert" | "text" | "utility" | "life" | "dev";

export type FaqItem = {
  question: string;
  answer: string;
};

/** 도구 안내 블록(사용법·기준·예시·주의 등) */
export type ToolSection = {
  title: string;
  content: string;
};

/**
 * 툴 정의. registry에 저장 후 getToolBySlug에서 기본값이 채워집니다.
 */
export type ToolDefinition = {
  slug: string;
  categoryId: CategoryId;
  title: string;
  shortTitle: string;
  /** 목록·메타용 한 줄 설명 */
  description: string;
  metaDescription: string;
  relatedSlugs: string[];
  faq: FaqItem[];
  /** SEO 키워드(선택). 비어 있으면 메타 keywords 생략 */
  keywords?: string[];
  /** 상단 H1 아래 짧은 소개(선택). 없으면 description 사용 */
  introText?: string;
  /** 하단 추가 설명(선택). 참고·면책 보조 문구 등 */
  bodyText?: string;
  /** `<title>`·검색 결과 제목. 없으면 title과 동일하게 취급 */
  seoTitle?: string;
  /** Open Graph·SNS용 제목. 없으면 seoTitle 또는 title */
  ogTitle?: string;
  /** OG 설명(카드 미리보기). 없으면 metaDescription */
  ogDescription?: string;
  /** 관련 도구 목록 위 한 줄 안내 */
  relatedIntro?: string;
  /** 본문 도구 안내(H2/H3). 없으면 기본 ‘사용 방법’ 접기만 표시 */
  toolSections?: ToolSection[];
  /** 홈·목록에서 대표 노출(선택) */
  featured?: boolean;
  /** 신규 툴 배지(선택) */
  isNew?: boolean;
  /** 내부 분류·필터·추천용 태그(선택). resolve 시 tool-meta와 병합됩니다. */
  tags?: string[];
  /** 검색 동의어·별칭(선택) */
  searchAliases?: string[];
  /** 세부 주제(선택). 예: 급여 클러스터 내 하위 주제 */
  subcategory?: string;
  /** 인기 섹션·추천 가중치(높을수록 상단). 기본은 메타 레이어 */
  popularityWeight?: number;
  /** 목록 수동 정렬(낮을수록 앞). 미설정 시 가중치·제목순 보조 */
  sortOrder?: number;
  /** stable / beta 등 */
  status?: "stable" | "beta";
  /** 짧은 활용 예시 문장(선택) */
  useCases?: string[];
};

/** UI·SEO용으로 기본값이 채워진 툴 */
export type ResolvedTool = ToolDefinition & {
  keywords: string[];
  introText: string;
  toolSections: ToolSection[];
  featured: boolean;
  isNew: boolean;
  tags: string[];
  searchAliases: string[];
  popularityWeight: number;
  sortOrder: number;
  status: "stable" | "beta";
  useCases: string[];
};
