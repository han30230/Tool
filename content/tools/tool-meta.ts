import type { CategoryId, ToolDefinition } from "./types";

/** 슬러그별 확장 메타(태그·별칭·가중치). registry 본문을 건드리지 않고 누적하기 좋습니다. */
export type ToolMetaLayer = {
  tags?: string[];
  searchAliases?: string[];
  popularityWeight?: number;
  sortOrder?: number;
  subcategory?: string;
  useCases?: string[];
};

const CATEGORY_LAYER: Record<
  CategoryId,
  { tags: string[]; searchAliases: string[] }
> = {
  calculator: {
    tags: ["계산", "calculator"],
    searchAliases: ["계산기", "금액"],
  },
  convert: {
    tags: ["변환", "단위", "unit"],
    searchAliases: ["환산", "단위변환"],
  },
  text: {
    tags: ["텍스트", "문서", "text"],
    searchAliases: ["문자열", "편집"],
  },
  utility: {
    tags: ["유틸", "utility"],
    searchAliases: ["도구", "간단"],
  },
  life: {
    tags: ["생활", "life"],
    searchAliases: ["일상", "라이프"],
  },
  dev: {
    tags: ["개발", "developer", "dev"],
    searchAliases: ["프로그래밍", "코딩"],
  },
};

/**
 * 슬러그별 태그·가중치. 새 툴 추가 시 여기에 한 줄만 넣어도 검색·추천·허브에 반영됩니다.
 * popularityWeight: 0–100 권장. 홈/브라우즈 인기 섹션에 사용.
 */
export const TOOL_META_BY_SLUG: Record<string, ToolMetaLayer> = {
  vat: {
    tags: ["부가세", "세금", "tax", "vat", "hub:tax-admin"],
    searchAliases: ["부가가치세", "10%"],
    popularityWeight: 96,
    sortOrder: 10,
  },
  percent: {
    tags: ["퍼센트", "비율", "hub:math-stats"],
    popularityWeight: 88,
    sortOrder: 20,
  },
  discount: {
    tags: ["할인", "쇼핑", "hub:shopping"],
    popularityWeight: 82,
    sortOrder: 30,
  },
  margin: {
    tags: ["마진", "원가", "판매", "hub:shopping", "hub:business-ops"],
    popularityWeight: 78,
    sortOrder: 40,
  },
  salary: {
    tags: ["연봉", "월급", "급여", "hub:salary-pay"],
    searchAliases: ["세전"],
    popularityWeight: 90,
    sortOrder: 15,
  },
  "take-home-pay": {
    tags: ["실수령", "세후", "급여", "4대보험", "hub:salary-pay", "hub:tax-admin"],
    searchAliases: ["월급 실수령"],
    popularityWeight: 92,
    sortOrder: 12,
  },
  "severance-pay": {
    tags: ["퇴직금", "급여", "hub:salary-pay"],
    popularityWeight: 80,
    sortOrder: 45,
  },
  "weekly-holiday-pay": {
    tags: ["주휴", "알바", "시급", "hub:salary-pay"],
    popularityWeight: 72,
    sortOrder: 50,
  },
  "annual-leave": {
    tags: ["연차", "휴가", "hub:salary-pay", "hub:business-ops"],
    popularityWeight: 74,
    sortOrder: 48,
  },
  date: {
    tags: ["날짜", "기간", "D-day", "hub:datetime"],
    searchAliases: ["일수"],
    popularityWeight: 86,
    sortOrder: 18,
  },
  area: {
    tags: ["평", "면적", "부동산", "㎡", "hub:real-estate", "hub:unit-conversion"],
    searchAliases: ["제곱미터"],
    popularityWeight: 84,
    sortOrder: 22,
  },
  "char-count": {
    tags: ["글자수", "문서", "hub:text-doc", "hub:content-marketing"],
    searchAliases: ["글자수세기"],
    popularityWeight: 80,
    sortOrder: 35,
  },
  whitespace: {
    tags: ["줄바꿈", "공백", "정리", "hub:text-doc"],
    popularityWeight: 70,
    sortOrder: 55,
  },
  "json-format": {
    tags: ["JSON", "포맷", "hub:data-dev", "hub:web-programming"],
    popularityWeight: 85,
    sortOrder: 25,
  },
  bmi: {
    tags: ["BMI", "체중", "건강", "hub:health"],
    popularityWeight: 83,
    sortOrder: 28,
  },
  loan: {
    tags: ["대출", "이자", "원리금", "금융", "hub:finance", "hub:real-estate"],
    searchAliases: ["주택담보"],
    popularityWeight: 94,
    sortOrder: 14,
  },
  "compound-interest": {
    tags: ["복리", "이자", "투자", "hub:finance"],
    popularityWeight: 76,
    sortOrder: 46,
  },
  "korean-age": {
    tags: ["나이", "만 나이", "hub:life", "hub:datetime"],
    popularityWeight: 68,
    sortOrder: 60,
  },
  dday: {
    tags: ["디데이", "카운트다운", "hub:datetime", "hub:life"],
    popularityWeight: 72,
    sortOrder: 52,
  },
  "hourly-monthly": {
    tags: ["시급", "월급", "환산", "hub:salary-pay"],
    popularityWeight: 70,
    sortOrder: 54,
  },
  "sleep-cycle": {
    tags: ["수면", "수면주기", "hub:health", "hub:life"],
    popularityWeight: 62,
    sortOrder: 70,
  },
  "password-generator": {
    tags: ["비밀번호", "보안", "hub:utility-tools", "hub:data-dev"],
    popularityWeight: 88,
    sortOrder: 24,
  },
  "random-number": {
    tags: ["난수", "주사위", "hub:utility-tools", "hub:game-ent"],
    popularityWeight: 75,
    sortOrder: 47,
  },
  "url-encode": {
    tags: ["URL", "인코딩", "hub:web-programming", "hub:data-dev"],
    popularityWeight: 78,
    sortOrder: 44,
  },
  base64: {
    tags: ["Base64", "인코딩", "hub:data-dev", "hub:web-programming"],
    popularityWeight: 82,
    sortOrder: 32,
  },
  "tip-calculator": {
    tags: ["팁", "팁계산", "hub:life", "hub:shopping"],
    popularityWeight: 66,
    sortOrder: 65,
  },
  "split-bill": {
    tags: ["N빵", "더치", "hub:life", "hub:shopping"],
    popularityWeight: 68,
    sortOrder: 62,
  },
  "water-intake": {
    tags: ["물", "수분", "hub:health", "hub:life"],
    popularityWeight: 58,
    sortOrder: 78,
  },
  "pace-calculator": {
    tags: ["페이스", "러닝", "운동", "hub:life"],
    popularityWeight: 64,
    sortOrder: 68,
  },
  "fuel-converter": {
    tags: ["연비", "효율", "hub:auto-travel", "hub:unit-conversion"],
    popularityWeight: 60,
    sortOrder: 72,
  },
  "world-clock": {
    tags: ["세계시계", "시차", "hub:datetime", "hub:life"],
    popularityWeight: 72,
    sortOrder: 53,
  },
  "speed-converter": {
    tags: ["속도", "kmh", "mph", "hub:unit-conversion", "hub:auto-travel"],
    popularityWeight: 58,
    sortOrder: 76,
  },
  "unix-timestamp": {
    tags: ["Unix", "타임스탬프", "epoch", "hub:datetime", "hub:data-dev"],
    popularityWeight: 84,
    sortOrder: 26,
  },
  "uuid-generator": {
    tags: ["UUID", "고유ID", "hub:data-dev"],
    popularityWeight: 86,
    sortOrder: 21,
  },
  "color-converter": {
    tags: ["색상", "HEX", "RGB", "hub:image-design", "hub:dev"],
    searchAliases: ["컬러"],
    popularityWeight: 80,
    sortOrder: 36,
  },
  "regex-tester": {
    tags: ["정규식", "regex", "hub:data-dev", "hub:web-programming"],
    popularityWeight: 78,
    sortOrder: 42,
  },
  "binary-converter": {
    tags: ["2진수", "16진수", "진법", "hub:data-dev", "hub:engineering-it"],
    popularityWeight: 70,
    sortOrder: 56,
  },
  "lorem-ipsum": {
    tags: ["로렘", "더미 텍스트", "hub:text-doc", "hub:content-marketing"],
    popularityWeight: 62,
    sortOrder: 74,
  },
  slugify: {
    tags: ["슬러그", "URL", "대소문자", "hub:text-doc", "hub:web-programming"],
    searchAliases: ["permalink"],
    popularityWeight: 76,
    sortOrder: 43,
  },
  "random-picker": {
    tags: ["추첨", "랜덤", "경품", "hub:utility-tools", "hub:game-ent"],
    searchAliases: ["명단", "뽑기"],
    popularityWeight: 80,
    sortOrder: 38,
  },
  "coin-flip": {
    tags: ["동전", "동전던지기", "hub:utility-tools", "hub:game-ent"],
    popularityWeight: 58,
    sortOrder: 78,
  },
  "qr-code-generator": {
    tags: ["QR", "QR코드", "hub:utility-tools", "hub:image-design"],
    popularityWeight: 90,
    sortOrder: 16,
  },
  "hash-generator": {
    tags: ["해시", "MD5", "SHA", "hub:data-dev"],
    popularityWeight: 86,
    sortOrder: 19,
  },
  "inch-cm": {
    tags: ["인치", "cm", "길이", "hub:unit-conversion"],
    popularityWeight: 78,
    sortOrder: 41,
  },
  "kg-lb": {
    tags: ["kg", "lb", "무게", "hub:unit-conversion", "hub:health"],
    popularityWeight: 76,
    sortOrder: 45,
  },
  "celsius-fahrenheit": {
    tags: ["섭씨", "화씨", "온도", "hub:unit-conversion"],
    popularityWeight: 80,
    sortOrder: 37,
  },
  "data-unit-converter": {
    tags: ["KB", "MB", "GB", "바이트", "hub:unit-conversion", "hub:data-dev"],
    searchAliases: ["용량"],
    popularityWeight: 82,
    sortOrder: 33,
  },
  "html-escape": {
    tags: ["HTML", "이스케이프", "엔티티", "hub:text-doc", "hub:web-programming"],
    popularityWeight: 74,
    sortOrder: 49,
  },
  "line-dedupe": {
    tags: ["중복제거", "줄", "목록", "hub:text-doc", "hub:data-dev"],
    popularityWeight: 72,
    sortOrder: 51,
  },
  "markdown-preview": {
    tags: ["Markdown", "마크다운", "md", "hub:text-doc", "hub:web-programming"],
    popularityWeight: 88,
    sortOrder: 20,
  },
  "csv-json": {
    tags: ["CSV", "JSON", "표", "hub:data-dev", "hub:web-programming"],
    popularityWeight: 84,
    sortOrder: 27,
  },
  "exchange-rate": {
    tags: ["환율", "통화", "달러", "hub:finance", "hub:trade-business"],
    popularityWeight: 91,
    sortOrder: 13,
  },
  "todo-checklist": {
    tags: ["할일", "체크리스트", "hub:utility-tools", "hub:business-ops"],
    popularityWeight: 78,
    sortOrder: 40,
  },
  "timer-stopwatch": {
    tags: ["타이머", "스톱워치", "hub:utility-tools", "hub:business-ops"],
    searchAliases: ["뽀모도로"],
    popularityWeight: 76,
    sortOrder: 44,
  },
  "image-compressor": {
    tags: ["이미지", "압축", "webp", "hub:image-design", "hub:file-pdf"],
    popularityWeight: 85,
    sortOrder: 29,
  },
  "pdf-merge-split": {
    tags: ["PDF", "병합", "분할", "hub:file-pdf"],
    searchAliases: ["문서"],
    popularityWeight: 87,
    sortOrder: 23,
  },
  "favicon-generator": {
    tags: ["파비콘", "아이콘", "ico", "hub:image-design", "hub:web-programming"],
    popularityWeight: 72,
    sortOrder: 52,
  },
  "xml-formatter": {
    tags: ["XML", "포맷", "RSS", "hub:data-dev", "hub:web-programming"],
    searchAliases: ["들여쓰기"],
    popularityWeight: 79,
    sortOrder: 39,
  },
  "yaml-json": {
    tags: ["YAML", "JSON", "설정", "hub:data-dev", "hub:web-programming"],
    searchAliases: ["야믈", "yml"],
    popularityWeight: 81,
    sortOrder: 34,
  },
  "jwt-decoder": {
    tags: ["JWT", "토큰", "Bearer", "hub:data-dev", "hub:web-programming"],
    searchAliases: ["디코드", "jwt decode"],
    popularityWeight: 83,
    sortOrder: 31,
  },
  "image-resizer": {
    tags: ["이미지", "리사이즈", "크기조절", "hub:image-design", "hub:file-pdf"],
    searchAliases: ["resize", "썸네일"],
    popularityWeight: 84,
    sortOrder: 30,
  },
  "image-format-converter": {
    tags: ["이미지", "포맷", "webp", "jpg", "png", "hub:image-design", "hub:file-pdf"],
    searchAliases: ["format", "변환"],
    popularityWeight: 83,
    sortOrder: 32,
  },
  "image-to-pdf": {
    tags: ["이미지", "PDF", "문서", "hub:file-pdf", "hub:image-design"],
    searchAliases: ["jpg to pdf", "png to pdf"],
    popularityWeight: 86,
    sortOrder: 24,
  },
  "pdf-to-image": {
    tags: ["PDF", "이미지", "PNG", "hub:file-pdf", "hub:image-design"],
    searchAliases: ["pdf png", "페이지 추출"],
    popularityWeight: 85,
    sortOrder: 28,
  },
  "sales-fee-calculator": {
    tags: ["수수료", "정산", "쇼핑", "hub:shopping", "hub:business-ops"],
    popularityWeight: 86,
    sortOrder: 23,
  },
  "unit-cost-with-shipping": {
    tags: ["단가", "원가", "배송비", "hub:shopping", "hub:business-ops"],
    popularityWeight: 82,
    sortOrder: 34,
  },
  "roi-calculator": {
    tags: ["ROI", "수익률", "hub:business-ops", "hub:finance"],
    popularityWeight: 84,
    sortOrder: 31,
  },
  "break-even": {
    tags: ["손익분기점", "BEP", "hub:business-ops", "hub:finance"],
    popularityWeight: 80,
    sortOrder: 37,
  },
  "jeonse-wolse": {
    tags: ["전월세", "보증금", "월세", "hub:real-estate", "hub:finance"],
    popularityWeight: 79,
    sortOrder: 41,
  },
  "meeting-time": {
    tags: ["회의", "생산성", "hub:business-ops", "hub:utility-tools"],
    popularityWeight: 72,
    sortOrder: 58,
  },
  "title-length": {
    tags: ["제목", "글자수", "hub:content-marketing", "hub:text-doc"],
    popularityWeight: 77,
    sortOrder: 46,
  },
  "meta-description-length": {
    tags: ["메타설명", "SEO", "hub:content-marketing", "hub:text-doc"],
    popularityWeight: 76,
    sortOrder: 47,
  },
  "hashtag-cleaner": {
    tags: ["해시태그", "정리", "hub:content-marketing", "hub:text-doc"],
    popularityWeight: 74,
    sortOrder: 50,
  },
  "ai-token-calculator": {
    tags: ["AI", "토큰", "LLM", "hub:ai", "hub:data-dev"],
    searchAliases: ["token calculator", "토큰 계산"],
    popularityWeight: 85,
    sortOrder: 28,
  },
  "prompt-length": {
    tags: ["AI", "프롬프트", "컨텍스트", "hub:ai", "hub:data-dev"],
    popularityWeight: 83,
    sortOrder: 33,
  },
  "model-cost-estimator": {
    tags: ["AI", "비용", "단가", "hub:ai", "hub:business-ops"],
    popularityWeight: 84,
    sortOrder: 31,
  },
  "text-chunk-splitter": {
    tags: ["AI", "청크", "RAG", "hub:ai", "hub:text-doc"],
    popularityWeight: 80,
    sortOrder: 37,
  },
  "json-schema-template": {
    tags: ["AI", "JSON", "Schema", "hub:ai", "hub:data-dev"],
    popularityWeight: 82,
    sortOrder: 35,
  },
};

export function mergeToolMeta(tool: ToolDefinition): {
  tags: string[];
  searchAliases: string[];
  popularityWeight: number;
  sortOrder: number;
  status: "stable" | "beta";
  useCases: string[];
  subcategory?: string;
} {
  const cat = CATEGORY_LAYER[tool.categoryId];
  const fromSlug = TOOL_META_BY_SLUG[tool.slug] ?? {};
  const tags = [...new Set([...(cat.tags ?? []), ...(tool.tags ?? []), ...(fromSlug.tags ?? [])])];
  const searchAliases = [
    ...new Set([
      ...(cat.searchAliases ?? []),
      ...(tool.searchAliases ?? []),
      ...(fromSlug.searchAliases ?? []),
    ]),
  ];
  const popularityWeight =
    fromSlug.popularityWeight ?? tool.popularityWeight ?? 50;
  const sortOrder = fromSlug.sortOrder ?? tool.sortOrder ?? 5000;
  const status = tool.status ?? "stable";
  const useCases = [...(tool.useCases ?? []), ...(fromSlug.useCases ?? [])];
  const subcategory = fromSlug.subcategory ?? tool.subcategory;

  return {
    tags,
    searchAliases,
    popularityWeight,
    sortOrder,
    status,
    useCases,
    ...(subcategory ? { subcategory } : {}),
  };
}
