import type { ToolDefinition } from "./types";

const faq = (items: { q: string; a: string }[]) =>
  items.map((x) => ({ question: x.q, answer: x.a }));

const sec = (a: string, b: string, c: string, d: string) => [
  { title: "어떻게 쓰나요?", content: a },
  { title: "동작 기준", content: b },
  { title: "예시", content: c },
  { title: "주의할 점", content: d },
];

export const phase4Tools: ToolDefinition[] = [
  {
    slug: "xml-formatter",
    categoryId: "text",
    title: "XML 포맷터",
    shortTitle: "XML",
    seoTitle: "XML 포맷터 — 들여쓰기·minify",
    ogDescription: "XML을 읽기 좋게 펼치거나 한 줄로 줄입니다. 브라우저 DOMParser로 파싱합니다.",
    description: "XML 문자열을 예쁘게 들여쓰기하거나 한 줄로 압축합니다.",
    introText: "RSS·설정 조각·SOAP 샘플처럼 XML을 다룰 때 씁니다. 파싱 오류 시 이유를 짧게 알려 줍니다.",
    metaDescription:
      "XML 포맷터: pretty·minify. DOMParser 기준, 로컬 처리. 로그인 불필요.",
    keywords: ["XML 포맷터", "XML pretty", "XML minify", "들여쓰기", "XML 정리"],
    bodyText: "네임스페이스·DOCTYPE이 복잡한 문서는 환경마다 다르게 보일 수 있습니다.",
    relatedIntro: "JSON·YAML·Base64 작업과 같은 데이터 흐름에서 이어 쓰기 좋습니다.",
    relatedSlugs: ["json-format", "yaml-json", "base64", "html-escape"],
    isNew: true,
    featured: true,
    toolSections: sec(
      "XML을 붙여 넣으면 포맷과 minify 결과가 갱신됩니다. 복사 버튼으로 각각 가져갈 수 있습니다.",
      "DOMParser(application/xml)로 파싱합니다. 잘못된 문법이면 오류 블록을 띄웁니다.",
      "예시 버튼으로 형식을 확인해 보세요.",
      "대용량·외부 엔티티·XXE는 다루지 않습니다. 민감한 데이터는 오프라인 도구를 권장합니다.",
    ),
    faq: faq([
      { q: "JSON이랑 같나요?", a: "아니요. JSON 전용은 JSON 포맷터를 쓰세요." },
      { q: "HTML도 되나요?", a: "XML 파서 기준이라 HTML5는 실패할 수 있습니다." },
      { q: "주석은?", a: "파서가 유지하면 결과에 남을 수 있습니다." },
      { q: "서버로 가나요?", a: "아니요. 브라우저에서만 처리합니다." },
      { q: "pretty와 minify 값이 조금 달라요.", a: "직렬화 방식 차이일 수 있습니다. 목적에 맞는 쪽을 쓰세요." },
      { q: "한글 속성·텍스트는?", a: "UTF-8 입력을 권장합니다." },
    ]),
  },
  {
    slug: "yaml-json",
    categoryId: "text",
    title: "YAML ↔ JSON 변환",
    shortTitle: "YAML·JSON",
    seoTitle: "YAML JSON 변환기 | 양방향",
    ogDescription: "YAML을 JSON으로, JSON을 YAML로 바꿉니다. js-yaml 기준.",
    description: "YAML과 JSON을 서로 변환합니다.",
    introText: "설정 파일·CI·K8s 조각을 API JSON으로 바꿀 때 씁니다. 입력은 브라우저에서만 처리됩니다.",
    metaDescription:
      "YAML JSON 변환: 양방향, js-yaml. 오류 메시지 표시, 로컬만.",
    keywords: ["YAML JSON", "YAML 변환", "JSON YAML", "설정 변환"],
    bodyText: "앵커·태그 등 고급 YAML은 결과가 기대와 다를 수 있습니다.",
    relatedIntro: "JSON 포맷터·XML·CSV 변환과 같은 편집 흐름에 넣기 좋습니다.",
    relatedSlugs: ["json-format", "csv-json", "xml-formatter", "markdown-preview"],
    isNew: true,
    featured: true,
    toolSections: sec(
      "방향을 고른 뒤 텍스트를 붙여 넣습니다. 결과가 아래에 갱신됩니다.",
      "YAML→JSON은 yaml.load, JSON→YAML은 yaml.dump(들여쓰기 2)입니다.",
      "예시 버튼으로 형식을 확인해 보세요.",
      "신뢰할 수 없는 YAML은 로드하지 마세요. 보안이 중요하면 오프라인 도구를 쓰세요.",
    ),
    faq: faq([
      { q: "JSON5나 주석이 있는 JSON은?", a: "표준 JSON.parse만 사용합니다. 실패하면 문법을 맞춰 주세요." },
      { q: "날짜·타임스탬프 타입은?", a: "YAML 규칙에 따라 문자열이나 객체로 변환될 수 있습니다." },
      { q: "한글 키는?", a: "UTF-8 문자열이면 됩니다." },
      { q: "대용량은?", a: "브라우저가 느려질 수 있어 적당한 크기로 나누세요." },
      { q: "서버 전송?", a: "하지 않습니다." },
      { q: "CSV는?", a: "CSV↔JSON 도구를 쓰세요." },
    ]),
  },
  {
    slug: "jwt-decoder",
    categoryId: "dev",
    title: "JWT 디코더",
    shortTitle: "JWT",
    seoTitle: "JWT 디코더 | 헤더·페이로드 확인",
    ogDescription: "JWT를 헤더·페이로드 JSON으로 풉니다. 서명 검증 없음.",
    description: "JWT 문자열의 헤더와 페이로드를 디코딩해 JSON으로 보여 줍니다.",
    introText: "디버깅·형식 확인용입니다. 서명 검증·만료 검사는 하지 않습니다.",
    metaDescription:
      "JWT 디코더: Base64url 디코딩, JSON 표시. 검증 없음, 로컬만.",
    keywords: ["JWT 디코더", "JWT decode", "Bearer 토큰", "헤더 페이로드"],
    bodyText: "이 페이지는 토큰 진위·권한을 판단하지 않습니다. 프로덕션 검증은 반드시 서버에서 하세요.",
    relatedIntro: "Base64·JSON·UUID 작업과 같은 개발 흐름에 이어 쓰기 좋습니다.",
    relatedSlugs: ["base64", "json-format", "uuid-generator", "unix-timestamp"],
    isNew: true,
    featured: true,
    toolSections: sec(
      "전체 JWT를 붙여 넣으면 헤더·페이로드가 JSON으로 나뉩니다.",
      "Base64url 디코딩 후 JSON.parse합니다. 세 번째 구간(서명)은 디코딩하지 않습니다.",
      "jwt.io 예시 토큰으로 시험해 볼 수 있습니다.",
      "실서비스 토큰을 화면에 남기지 마세요. 공유·녹화 환경을 주의하세요.",
    ),
    faq: faq([
      { q: "서명 검증은?", a: "하지 않습니다. 서버에서 비밀키·공개키로 검증하세요." },
      { q: "만료(exp)는?", a: "숫자로 보기만 합니다. 자동 거부하지 않습니다." },
      { q: "페이로드가 JSON이 아니에요.", a: "일부 토큰은 비표준일 수 있습니다." },
      { q: "민감한 토큰을 넣어도 되나요?", a: "가능하면 테스트용만 쓰고, 끝나면 지우세요." },
      { q: "JWE는?", a: "암호화된 JWT는 여기서 풀 수 없습니다." },
      { q: "서버로 전송?", a: "하지 않습니다." },
    ]),
  },
];
