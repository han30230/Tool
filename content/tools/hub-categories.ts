import type { CategoryId, ResolvedTool } from "./types";

export type HubCategoryId =
  | "salary-pay"
  | "finance"
  | "trade-business"
  | "health"
  | "math-stats"
  | "unit-conversion"
  | "datetime"
  | "life"
  | "auto-travel"
  | "engineering-it"
  | "space-astro"
  | "ai"
  | "misc"
  | "utility-tools"
  | "text-doc"
  | "file-pdf"
  | "image-design"
  | "data-dev"
  | "web-programming"
  | "education"
  | "game-ent"
  | "shopping"
  | "real-estate"
  | "tax-admin"
  | "business-ops"
  | "content-marketing";

export type HubCategory = {
  id: HubCategoryId;
  title: string;
  /** 카드·SEO용 짧은 설명 */
  description: string;
  /** 기존 6개 카테고리와의 연결(필터 기본값) */
  primaryCategories: CategoryId[];
  /** hub 태그(hub:xxx) 또는 슬러그·카테고리로 매칭 */
  match: (tool: ResolvedTool) => boolean;
};

const hasHub = (tool: ResolvedTool, id: string) => tool.tags.some((t) => t === `hub:${id}` || t === id);

export const hubCategories: HubCategory[] = [
  {
    id: "salary-pay",
    title: "급여·연봉",
    description: "연봉·월급 환산, 실수령·퇴직금·주휴·연차 등 급여·근로 관련 도구.",
    primaryCategories: ["calculator"],
    match: (t) => hasHub(t, "salary-pay") || ["salary", "take-home-pay", "severance-pay", "weekly-holiday-pay", "annual-leave", "hourly-monthly"].includes(t.slug),
  },
  {
    id: "finance",
    title: "금융·재무",
    description: "대출·복리·환율·마진·할인 등 금액과 비율을 다루는 도구.",
    primaryCategories: ["calculator"],
    match: (t) => hasHub(t, "finance") || ["loan", "compound-interest", "exchange-rate", "margin", "discount", "percent"].includes(t.slug),
  },
  {
    id: "trade-business",
    title: "무역·업무",
    description: "환율·시간·문서 등 업무·무역 흐름에 맞춘 도구.",
    primaryCategories: ["calculator", "life"],
    match: (t) => hasHub(t, "trade-business") || ["exchange-rate", "world-clock", "date"].includes(t.slug),
  },
  {
    id: "health",
    title: "건강·영양",
    description: "BMI·수분·수면 등 생활 건강 참고용.",
    primaryCategories: ["life", "calculator"],
    match: (t) => hasHub(t, "health") || ["bmi", "water-intake", "sleep-cycle"].includes(t.slug),
  },
  {
    id: "math-stats",
    title: "수학·통계",
    description: "퍼센트·할인·마진·난수 등 숫자와 비율.",
    primaryCategories: ["calculator", "utility"],
    match: (t) => hasHub(t, "math-stats") || ["percent", "discount", "margin", "random-number"].includes(t.slug),
  },
  {
    id: "unit-conversion",
    title: "단위변환",
    description: "길이·무게·온도·데이터 용량·속도·연비 등 단위 환산.",
    primaryCategories: ["convert"],
    match: (t) =>
      hasHub(t, "unit-conversion") ||
      [
        "inch-cm",
        "kg-lb",
        "celsius-fahrenheit",
        "data-unit-converter",
        "area",
        "speed-converter",
        "fuel-converter",
      ].includes(t.slug),
  },
  {
    id: "datetime",
    title: "날짜·시간",
    description: "날짜 차이·D-day·Unix 시간·세계 시계.",
    primaryCategories: ["calculator", "dev", "life"],
    match: (t) =>
      hasHub(t, "datetime") ||
      ["date", "dday", "unix-timestamp", "world-clock", "korean-age", "timer-stopwatch"].includes(t.slug),
  },
  {
    id: "life",
    title: "라이프",
    description: "팁·N빈·물·러닝·시계 등 일상·여행·운동.",
    primaryCategories: ["life"],
    match: (t) => hasHub(t, "life") || ["tip-calculator", "split-bill", "water-intake", "pace-calculator", "world-clock", "fuel-converter"].includes(t.slug),
  },
  {
    id: "auto-travel",
    title: "자동차·여행",
    description: "속도·연비·시차·환율 등 이동·여행에 참고.",
    primaryCategories: ["life", "convert"],
    match: (t) => hasHub(t, "auto-travel") || ["speed-converter", "fuel-converter", "world-clock", "exchange-rate"].includes(t.slug),
  },
  {
    id: "engineering-it",
    title: "공학·IT",
    description: "진법·단위·정규식 등 개발·공학 보조.",
    primaryCategories: ["dev"],
    match: (t) => hasHub(t, "engineering-it") || ["binary-converter", "regex-tester", "unix-timestamp"].includes(t.slug),
  },
  {
    id: "space-astro",
    title: "우주·천문",
    description: "향후 천문·시간 도구를 모을 자리입니다.",
    primaryCategories: ["life"],
    match: () => false,
  },
  {
    id: "ai",
    title: "AI·인공지능",
    description: "토큰·프롬프트·비용 등 AI·LLM 보조 도구를 확장할 예정입니다.",
    primaryCategories: ["dev", "text"],
    match: (t) =>
      hasHub(t, "ai") ||
      [
        "ai-token-calculator",
        "prompt-length",
        "model-cost-estimator",
        "text-chunk-splitter",
        "json-schema-template",
      ].includes(t.slug),
  },
  {
    id: "misc",
    title: "기타",
    description: "위 주제에 속하지 않거나 실험 단계인 도구.",
    primaryCategories: ["utility"],
    match: (t) => t.tags.includes("hub:misc"),
  },
  {
    id: "utility-tools",
    title: "유틸리티·도구",
    description: "비밀번호·QR·추첨·난수·타이머 등 가볍게 쓰는 도구.",
    primaryCategories: ["utility"],
    match: (t) =>
      hasHub(t, "utility-tools") ||
      ["password-generator", "qr-code-generator", "random-picker", "coin-flip", "random-number", "todo-checklist", "timer-stopwatch"].includes(t.slug),
  },
  {
    id: "text-doc",
    title: "텍스트·문서",
    description: "글자 수·줄 정리·Markdown·CSV·슬러그·HTML 이스케이프.",
    primaryCategories: ["text"],
    match: (t) =>
      hasHub(t, "text-doc") ||
      [
        "char-count",
        "whitespace",
        "json-format",
        "markdown-preview",
        "csv-json",
        "slugify",
        "html-escape",
        "line-dedupe",
        "lorem-ipsum",
        "xml-formatter",
        "yaml-json",
      ].includes(t.slug),
  },
  {
    id: "file-pdf",
    title: "파일·PDF",
    description: "PDF 병합·분할·이미지 압축 등 파일 처리.",
    primaryCategories: ["dev"],
    match: (t) =>
      hasHub(t, "file-pdf") ||
      [
        "pdf-merge-split",
        "image-compressor",
        "image-resizer",
        "image-format-converter",
        "image-to-pdf",
        "pdf-to-image",
      ].includes(t.slug),
  },
  {
    id: "image-design",
    title: "이미지·디자인",
    description: "이미지 압축·색상·파비콘·QR 등 시각·웹 자산.",
    primaryCategories: ["dev", "utility"],
    match: (t) =>
      hasHub(t, "image-design") ||
      [
        "image-compressor",
        "color-converter",
        "favicon-generator",
        "qr-code-generator",
        "image-resizer",
        "image-format-converter",
        "image-to-pdf",
        "pdf-to-image",
      ].includes(t.slug),
  },
  {
    id: "data-dev",
    title: "데이터·개발",
    description: "JSON·CSV·UUID·해시·Base64·진법·정규식.",
    primaryCategories: ["dev", "text"],
    match: (t) =>
      hasHub(t, "data-dev") ||
      [
        "json-format",
        "csv-json",
        "uuid-generator",
        "hash-generator",
        "base64",
        "binary-converter",
        "regex-tester",
        "unix-timestamp",
        "url-encode",
        "line-dedupe",
        "data-unit-converter",
        "xml-formatter",
        "yaml-json",
        "jwt-decoder",
      ].includes(t.slug),
  },
  {
    id: "web-programming",
    title: "웹·프로그래밍",
    description: "URL·HTML·Markdown·슬러그·색상 등 웹 작업.",
    primaryCategories: ["text", "dev"],
    match: (t) =>
      hasHub(t, "web-programming") ||
      [
        "url-encode",
        "html-escape",
        "slugify",
        "markdown-preview",
        "json-format",
        "color-converter",
        "favicon-generator",
        "xml-formatter",
        "yaml-json",
        "jwt-decoder",
      ].includes(t.slug),
  },
  {
    id: "education",
    title: "교육·학습",
    description: "학습·암기·퀴즈류 도구를 확장할 예정입니다.",
    primaryCategories: ["life", "utility"],
    match: () => false,
  },
  {
    id: "game-ent",
    title: "게임·엔터테인먼트",
    description: "추첨·동전·난수 등 가벼운 참여용.",
    primaryCategories: ["utility"],
    match: (t) => hasHub(t, "game-ent") || ["random-picker", "coin-flip", "random-number"].includes(t.slug),
  },
  {
    id: "shopping",
    title: "쇼핑·판매",
    description: "할인·마진·팁·N빵 등 구매·판매 참고.",
    primaryCategories: ["calculator", "life"],
    match: (t) => hasHub(t, "shopping") || ["discount", "margin", "tip-calculator", "split-bill", "percent"].includes(t.slug),
  },
  {
    id: "real-estate",
    title: "부동산·주거",
    description: "평·㎡·대출 등 주거·부동산 참고.",
    primaryCategories: ["convert", "calculator"],
    match: (t) => hasHub(t, "real-estate") || ["area", "loan"].includes(t.slug),
  },
  {
    id: "tax-admin",
    title: "세금·행정",
    description: "부가세·실수령 등 세금·행정 참고(법률 자문 아님).",
    primaryCategories: ["calculator"],
    match: (t) => hasHub(t, "tax-admin") || ["vat", "take-home-pay"].includes(t.slug),
  },
  {
    id: "business-ops",
    title: "비즈니스·운영",
    description: "연차·타이머·체크리스트 등 업무 운영 보조.",
    primaryCategories: ["calculator", "utility"],
    match: (t) => hasHub(t, "business-ops") || ["annual-leave", "timer-stopwatch", "todo-checklist", "severance-pay"].includes(t.slug),
  },
  {
    id: "content-marketing",
    title: "콘텐츠·마케팅",
    description: "글자 수·더미 텍스트·슬러그 등 콘텐츠 제작 보조.",
    primaryCategories: ["text"],
    match: (t) => hasHub(t, "content-marketing") || ["char-count", "lorem-ipsum", "slugify"].includes(t.slug),
  },
];

export function getHubById(id: string): HubCategory | undefined {
  return hubCategories.find((h) => h.id === id);
}

export function filterToolsByHub(tools: ResolvedTool[], hubId: HubCategoryId): ResolvedTool[] {
  const hub = getHubById(hubId);
  if (!hub) return [];
  return tools.filter((t) => hub.match(t));
}
