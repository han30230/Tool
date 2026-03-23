import type { ToolDefinition } from "./types";

/** min-inter 스타일 유입용 툴 2차 배치 — FAQ·섹션 포함 */
export const additionalTools: ToolDefinition[] = [
  {
    slug: "bmi",
    categoryId: "calculator",
    title: "BMI 계산기",
    shortTitle: "BMI",
    seoTitle: "BMI 계산기 | 체질량지수·비만도 참고",
    ogDescription:
      "키와 체중으로 BMI를 바로 계산합니다. 로그인 없이 모바일에서 즉시. 참고용입니다.",
    description: "키(cm)와 체중(kg)으로 체질량지수(BMI)와 대략적인 구분을 표시합니다.",
    introText:
      "건강검진·다이어트 전에 대략적인 수치를 가늠할 때 쓰는 참고용 도구입니다. 체지방률·허리둘레는 반영하지 않습니다.",
    metaDescription:
      "BMI 계산기: 키·체중으로 체질량지수 계산. 대한비만학회 기준 구분 표시, 모바일 즉시, 로그인 없음.",
    keywords: ["BMI 계산기", "체질량지수", "비만도", "키 체중", "다이어트 BMI"],
    bodyText:
      "BMI는 체형을 나타내는 지표 중 하나일 뿐 근육량·골격·연령·임신 등은 구분하지 않습니다. 진단·치료는 의료 전문가에게 맡기세요.",
    relatedIntro: "날짜·나이·비율을 같이 볼 때 아래 도구로 이어가 보세요.",
    relatedSlugs: ["korean-age", "percent", "date", "loan"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "키와 체중을 숫자로 넣으면 BMI와 구분(저체중·정상·과체중·비만)이 갱신됩니다. 소수점은 표시 규칙에 따라 반올림됩니다.",
      },
      {
        title: "계산 기준",
        content:
          "BMI = 체중(kg) ÷ 키(m)².\n구분은 대한비만학회 기준(한국인)을 단순화해 표시합니다.",
      },
      {
        title: "예시",
        content: "키 170cm, 체중 65kg → BMI 약 22.5로 정상 범위에 가깝게 나옵니다.",
      },
      {
        title: "주의할 점",
        content:
          "운동선수·노인·성장기 아동에게는 BMI만으로 판단하기 어렵습니다. 참고용입니다.",
      },
    ],
    faq: [
      {
        question: "BMI와 체지방률은 같나요?",
        answer: "아닙니다. BMI는 키 대비 체중 비율이고, 체지방률은 별도 측정이 필요합니다.",
      },
      {
        question: "임산부도 써도 되나요?",
        answer: "임신 중에는 일반 BMI 기준이 맞지 않을 수 있습니다. 산부인과 상담을 따르세요.",
      },
      {
        question: "소수점은 어떻게 되나요?",
        answer: "BMI는 소수 첫째 자리까지 반올림해 보여 줄 수 있습니다.",
      },
      {
        question: "해외 기준과 다른가요?",
        answer: "구간 표기는 기관·국가에 따라 다를 수 있습니다. 이 페이지는 흔히 쓰는 한국 기준을 참고했습니다.",
      },
      {
        question: "스마트체중계와 숫자가 달라요.",
        answer: "입력값·반올림·측정 시점이 다르면 달라질 수 있습니다.",
      },
      {
        question: "의학적 진단인가요?",
        answer: "아니요. 참고용 계산만 제공합니다.",
      },
    ],
  },
  {
    slug: "loan",
    categoryId: "calculator",
    title: "대출 이자 계산기",
    shortTitle: "대출",
    seoTitle: "대출 이자 계산기 | 원리금균등 월 상환",
    ogDescription:
      "원금·금리·기간으로 원리금균등 월 상환액과 총 이자를 추정합니다. 로그인 없이 모바일에서.",
    description: "원리금균등 상환을 가정해 월 상환액·총 이자를 간단히 계산합니다.",
    introText:
      "주택·신용 대출의 대략적인 상환 부담을 가늠할 때 쓰는 참고용 도구입니다. 금리 변동·중도상환·우대는 반영하지 않습니다.",
    metaDescription:
      "대출 이자 계산기: 원리금균등 월 상환액·총 이자 추정. 연이율·기간 입력, 참고용, 모바일 즉시.",
    keywords: ["대출 이자 계산기", "원리금균등", "월 상환액", "주택담보대출 계산", "대출 이자"],
    bodyText:
      "실제 금리·상환 방식·수수료는 금융사 약관을 따릅니다. 계약 전 반드시 금융기관에서 확인하세요.",
    relatedIntro: "복리·퍼센트·급여 도구와 함께 보면 금액 감을 잡기 쉽습니다.",
    relatedSlugs: ["compound-interest", "percent", "take-home-pay", "salary"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "대출 원금(원), 연이율(%), 상환 개월 수를 넣습니다. 결과는 원리금균등 방식의 월 상환액과 총 이자 추정입니다.",
      },
      {
        title: "계산 기준",
        content:
          "월 이율 = 연이율 ÷ 12로 두고, 일반적인 원리금균등 공식을 사용합니다. 월이율 0%면 원금만 균등 나눕니다.",
      },
      {
        title: "예시",
        content: "원금 2억 원, 연이율 4.5%, 240개월이면 월 상환액·총 이자의 규모를 비교해 볼 수 있습니다.",
      },
      {
        title: "주의할 점",
        content:
          "고정·변동 금리, 거치, 중도상환 수수료, 보험료는 포함하지 않습니다.",
      },
    ],
    faq: [
      {
        question: "원금 균등과 뭐가 다른가요?",
        answer:
          "이 도구는 원리금균등(매월 상환액 동일)만 다룹니다. 원금 균등은 다른 공식입니다.",
      },
      {
        question: "금리가 바뀌면?",
        answer: "변동 금리는 시점마다 달라질 수 있어 여기서는 단일 금리만 넣습니다.",
      },
      {
        question: "중도상환은?",
        answer: "반영하지 않습니다. 수수료·절약 이자는 금융사 시뮬레이터를 이용하세요.",
      },
      {
        question: "전세자금대출도 되나요?",
        answer: "숫자만 넣으면 같은 공식으로 월액을 추정할 수 있으나, 상품 조건은 직접 확인해야 합니다.",
      },
      {
        question: "이자가 왜 이렇게 많나요?",
        answer: "장기·복리 구조상 총 이자가 커질 수 있습니다. 기간을 줄이면 총 이자는 줄어듭니다.",
      },
      {
        question: "법적 효력이 있나요?",
        answer: "없습니다. 참고용입니다.",
      },
    ],
  },
  {
    slug: "compound-interest",
    categoryId: "calculator",
    title: "복리 계산기",
    shortTitle: "복리",
    seoTitle: "복리 계산기 | 적금·예금 이자 추정",
    ogDescription:
      "원금·연이율·기간으로 복리 만기액을 추정합니다. 로그인 없이 브라우저에서 바로.",
    description: "원금, 연이율, 기간, 복리 주기를 넣어 만기 예상액과 이자 합계를 계산합니다.",
    introText:
      "적금·예금의 대략적인 불리 효과를 볼 때 쓰는 참고용 도구입니다. 세금·우대금리·이자 과세는 반영하지 않습니다.",
    metaDescription:
      "복리 계산기: 원금·금리·년수·복리주기로 만기 추정. 이자 합계, 모바일 즉시, 참고용.",
    keywords: ["복리 계산기", "적금 이자", "예금 복리", "이자 계산", "만기 금액"],
    bodyText:
      "실제 상품은 세금·우대·인출 조건에 따라 달라집니다. 가입 전 상품 설명서를 확인하세요.",
    relatedIntro: "대출 이자·퍼센트와 비교해 보면 이자 흐름을 이해하기 쉽습니다.",
    relatedSlugs: ["loan", "percent", "vat", "salary"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "원금, 연이율(%), 기간(년), 복리 주기(연·월 등)를 선택합니다. 만기 예상액과 이자 합계가 표시됩니다.",
      },
      {
        title: "계산 기준",
        content:
          "A = P(1 + r/n)^(nt) 형태를 사용합니다. n은 연 복리 횟수입니다.",
      },
      {
        title: "예시",
        content: "원금 1,000만 원, 연이율 3.5%, 5년, 월복리면 만기액의 대략을 비교할 수 있습니다.",
      },
      {
        title: "주의할 점",
        content: "인플레·세금·원금 보장 여부는 반영하지 않습니다.",
      },
    ],
    faq: [
      {
        question: "단리와 차이는?",
        answer: "단리는 원금에만 이자가 붙고, 복리는 이자에 다시 이자가 붙는 모델입니다.",
      },
      {
        question: "월복리는 뭔가요?",
        answer: "1년에 12번 이자가 붙는 가정입니다. 상품마다 이자 붙는 시점이 다릅니다.",
      },
      {
        question: "세후 이자인가요?",
        answer: "아니요. 세금 공제 전 추정치입니다.",
      },
      {
        question: "적금은 매월 넣는데?",
        answer: "이 도구는 일시불 원금만 다룹니다. 적립식은 다른 계산이 필요합니다.",
      },
      {
        question: "금리가 0%면?",
        answer: "원금 그대로 만기액으로 표시됩니다.",
      },
      {
        question: "투자 권유인가요?",
        answer: "아니요. 참고용 계산만 제공합니다.",
      },
    ],
  },
  {
    slug: "korean-age",
    categoryId: "calculator",
    title: "만 나이·세는 나이 계산기",
    shortTitle: "만 나이",
    seoTitle: "만 나이 계산기 | 세는 나이 참고",
    ogDescription:
      "생년월일과 기준일로 만 나이와 연도 차이를 바로 확인합니다. 로그인 없이 모바일에서.",
    description: "생년월일과 기준일을 입력하면 만 나이와 참고용 세는 나이를 표시합니다.",
    introText:
      "서류·이벤트 연령을 가늠할 때 쓰는 참고용 도구입니다. 법정 연령·행정 처리는 각 기관 기준을 따릅니다.",
    metaDescription:
      "만 나이 계산기: 생년월일·기준일로 만 나이·연도 차이. 세는 나이 참고값, 모바일 즉시.",
    keywords: ["만 나이 계산기", "세는 나이", "연 나이", "나이 계산", "생년월일"],
    bodyText:
      "‘세는 나이’ 표기는 단순 참고이며, 법 개정·행정 일자에 따라 달라질 수 있습니다.",
    relatedIntro: "날짜 차이·연차·D-day와 함께 보면 일정 잡기에 도움이 됩니다.",
    relatedSlugs: ["dday", "date", "annual-leave", "sleep-cycle"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "생년월일과 기준일(오늘 등)을 YYYY-MM-DD로 입력합니다. 만 나이와 연도 차이·세는 나이(참고)가 나옵니다.",
      },
      {
        title: "계산 기준",
        content:
          "만 나이는 생일이 지났는지로 완전한 연수를 셉니다. 세는 나이는 연도만 보는 단순 모델입니다.",
      },
      {
        title: "예시",
        content: "기준일을 시험일·계약일로 바꿔 보면 그날의 만 나이를 확인할 수 있습니다.",
      },
      {
        title: "주의할 점",
        content: "법정 연령(음주·선거 등)은 반드시 관할 기관 안내를 확인하세요.",
      },
    ],
    faq: [
      {
        question: "법적 만 나이와 같나요?",
        answer: "원칙적으로 같은 방식으로 많이 쓰이지만, 특정 분야는 별도 규정이 있을 수 있습니다.",
      },
      {
        question: "윤년생은?",
        answer: "생일이 2월 29일인 경우 브라우저 날짜 처리에 따라 표시가 달라질 수 있어 날짜를 직접 확인하세요.",
      },
      {
        question: "해외 나이 표기와 같나요?",
        answer: "만 나이 개념은 비슷하지만 국가별 세부는 다를 수 있습니다.",
      },
      {
        question: "기준일이 생일 전이면?",
        answer: "만 나이는 아직 생일이 안 지난 것으로 한 살 적게 나옵니다.",
      },
      {
        question: "출생 시각까지 반영하나요?",
        answer: "아니요. 날짜만 사용합니다.",
      },
      {
        question: "주민번호 뒷자리가 필요한가요?",
        answer: "아니요. 생년월일만으로 계산합니다.",
      },
    ],
  },
  {
    slug: "dday",
    categoryId: "calculator",
    title: "D-day 계산기",
    shortTitle: "D-day",
    seoTitle: "D-day 계산기 | 시험·여행까지 며칠",
    ogDescription:
      "기준일과 목표일로 D-day와 남은 일 수를 바로 봅니다. 로그인 없이 모바일에서.",
    description: "기준일(보통 오늘)과 목표일 사이의 일 수와 D-day 표기를 보여 줍니다.",
    introText:
      "시험·취업·여행까지 며칠 남았는지 가늠할 때 쓰는 도구입니다. 날짜 계산기의 ‘기간’과 같은 방식입니다.",
    metaDescription:
      "D-day 계산기: 기준일·목표일로 남은 일 수·D-day 표기. 과거 목표면 D+ 형태, 모바일 즉시.",
    keywords: ["D-day 계산기", "디데이", "남은 날짜", "시험 D-day", "카운트다운"],
    bodyText:
      "일 수는 ‘목표일 − 기준일’의 달력 일 수입니다. 업무상 포함일 규칙은 따로 맞춰야 할 수 있습니다.",
    relatedIntro: "날짜 더하기·나이 계산과 이어서 쓰면 일정 정리가 수월합니다.",
    relatedSlugs: ["date", "korean-age", "annual-leave", "sleep-cycle"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "기준일(오늘 등)과 목표일을 넣습니다. 목표가 미래면 D-일수, 과거면 D+일수 형태로 읽을 수 있습니다.",
      },
      {
        title: "계산 기준",
        content:
          "두 날짜의 차이를 일 단위로 셉니다. 시간은 넣지 않고 자정 기준 날짜만 사용합니다.",
      },
      {
        title: "예시",
        content: "기준일을 오늘, 목표일을 시험일로 두면 남은 일 수를 바로 확인할 수 있습니다.",
      },
      {
        title: "주의할 점",
        content: "타임존은 브라우저 로컬 기준입니다.",
      },
    ],
    faq: [
      {
        question: "날짜 계산기와 뭐가 다른가요?",
        answer: "D-day는 ‘며칠 남았는지’에 초점을 둔 화면이고, 날짜 계산기는 더하기·빼기까지 지원합니다.",
      },
      {
        question: "시작일을 포함하나요?",
        answer: "이 도구는 종료−시작 일 수만 표시합니다. ‘하루 더’가 필요하면 결과에 맞게 조정하세요.",
      },
      {
        question: "목표일이 지났으면?",
        answer: "음수 일수 또는 D+ 형태로 표시될 수 있습니다.",
      },
      {
        question: "윤년은?",
        answer: "달력 일 수로 계산하므로 윤년이 반영됩니다.",
      },
      {
        question: "해외 시차는?",
        answer: "반영하지 않습니다. 로컬 날짜만 사용합니다.",
      },
      {
        question: "자정 넘어가면 바뀌나요?",
        answer: "기준일을 오늘로 두었다면 다음 날 다시 열면 일 수가 하루 줄어듭니다.",
      },
    ],
  },
  {
    slug: "hourly-monthly",
    categoryId: "calculator",
    title: "시급·월급 환산 계산기",
    shortTitle: "시급·월급",
    seoTitle: "시급 월급 계산기 | 알바·파트 환산",
    ogDescription:
      "시급과 주간 근로시간으로 월 금액을, 월급으로 시급을 추정합니다. 로그인 없이 모바일에서.",
    description: "시급→월 또는 월급→시급을 주간 근로시간과 함께 간단히 환산합니다.",
    introText:
      "알바·파트 급여를 월 기준으로 맞춰 볼 때 쓰는 참고용 도구입니다. 주휴·수당·세금은 반영하지 않습니다.",
    metaDescription:
      "시급 월급 계산기: 주간 시간 기준 월 환산(52주÷12개월). 역산 시급, 참고용, 모바일 즉시.",
    keywords: ["시급 월급 계산", "시급 환산", "알바 월급", "파트타임 급여", "주휴 전"],
    bodyText:
      "실제 지급은 주휴수당·연장·야간·세금에 따라 달라집니다. 급여명세를 기준으로 하세요.",
    relatedIntro: "주휴수당·실수령액·연봉 환산과 연결해 보면 전체 그림이 잡힙니다.",
    relatedSlugs: ["weekly-holiday-pay", "take-home-pay", "salary", "percent"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "‘시급→월’ 또는 ‘월급→시급’을 고르고, 주간 근로시간과 금액을 넣습니다.",
      },
      {
        title: "계산 기준",
        content:
          "한 달 ≈ 52주 ÷ 12개월로 환산해 시급×주간시간×(52/12)로 월액을 추정합니다.",
      },
      {
        title: "예시",
        content: "시급 10,030원, 주 20시간이면 월 환산 금액의 규모를 가늠할 수 있습니다.",
      },
      {
        title: "주의할 점",
        content: "월 소정근로일수·유급휴일은 반영하지 않습니다.",
      },
    ],
    faq: [
      {
        question: "주휴수당은 포함되나요?",
        answer: "아니요. 주휴수당 계산기를 별도로 쓰세요.",
      },
      {
        question: "월 환산이 왜 이런 식인가요?",
        answer: "연중 주 수를 월로 나눈 흔한 근사치입니다. 회사·근로계약과 다를 수 있습니다.",
      },
      {
        question: "최저임금과 비교하려면?",
        answer: "시급 입력 후 결과를 비교하세요. 법정 최저임금은 매년 갱신됩니다.",
      },
      {
        question: "세후 금액인가요?",
        answer: "입력한 금액 기준 그대로 계산합니다. 세전·세후를 섞지 마세요.",
      },
      {
        question: "주 52시간 제한은?",
        answer: "이 도구는 시간 제한 검사를 하지 않습니다.",
      },
      {
        question: "실수령과 연결하려면?",
        answer: "실수령액 계산기에서 세전 월급을 넣어 추정할 수 있습니다.",
      },
    ],
  },
  {
    slug: "sleep-cycle",
    categoryId: "calculator",
    title: "수면 사이클 계산기",
    shortTitle: "수면",
    seoTitle: "수면 사이클 계산기 | 기상 시각 기준 취침",
    ogDescription:
      "기상 목표 시각을 넣으면 90분 주기 기준 취침 시각을 참고로 보여 줍니다. 모바일에서 바로.",
    description: "기상 시각과 수면 사이클(참고)을 바탕으로 취침 시각을 추천합니다.",
    introText:
      "알람을 맞출 때 참고할 수 있는 단순 모델입니다. 수면 단계·개인차는 반영하지 않습니다.",
    metaDescription:
      "수면 사이클 계산기: 기상 시각 기준 4~6사이클 취침 시각 참고. 의학 아님, 모바일 즉시.",
    keywords: ["수면 사이클", "기상 시간", "취침 시간", "90분 수면", "알람"],
    bodyText:
      "수면의 질은 생활습관·질환에 따라 다릅니다. 불면·코골이 등은 전문의 상담을 받으세요.",
    relatedIntro: "D-day·날짜 계산과 같이 쓰면 일정·컨디션을 함께 볼 수 있습니다.",
    relatedSlugs: ["dday", "date", "bmi", "korean-age"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "기상 목표 시각(HH:MM)을 입력합니다. 4~6사이클 기준 취침 시각이 참고로 표시됩니다.",
      },
      {
        title: "계산 기준",
        content:
          "한 사이클 90분, 잠들기까지 여유 약 14분을 단순히 뺍니다. 개인차가 큽니다.",
      },
      {
        title: "예시",
        content: "7시 기상이면 그에 맞춰 여러 취침 후보를 비교해 볼 수 있습니다.",
      },
      {
        title: "주의할 점",
        content: "의학적 수면 검사·치료를 대체하지 않습니다.",
      },
    ],
    faq: [
      {
        question: "꼭 90분인가요?",
        answer: "성인에서 흔히 쓰는 참고값일 뿐, 사람마다 다릅니다.",
      },
      {
        question: "낮잠은?",
        answer: "이 도구는 하룻밤 수면 가정만 합니다.",
      },
      {
        question: "알람을 몇 시에 맞추나요?",
        answer: "기상 목표에 맞춰 알람을 설정하고, 취침은 참고 시각 전후로 조절해 보세요.",
      },
      {
        question: "불면증이 있는데 써도 되나요?",
        answer: "참고용입니다. 지속적인 불면은 병원 상담이 필요합니다.",
      },
      {
        question: "시차 적응에?",
        answer: "시차는 별도 문제라 이 모델만으로는 부족할 수 있습니다.",
      },
      {
        question: "아이 수면에?",
        answer: "아동은 성인과 패턴이 다릅니다. 소아과·수면 클리닉을 참고하세요.",
      },
    ],
  },
  {
    slug: "password-generator",
    categoryId: "utility",
    title: "비밀번호 생성기",
    shortTitle: "비밀번호",
    seoTitle: "비밀번호 생성기 | 랜덤 강도 조절",
    ogDescription:
      "길이와 문자 종류를 고른 뒤 안전한 랜덤 비밀번호를 만듭니다. 저장하지 않습니다.",
    description: "소문자·대문자·숫자·기호 조합으로 랜덤 비밀번호를 생성합니다.",
    introText:
      "새 계정·임시 비밀번호가 필요할 때 쓰는 도구입니다. 생성 문자는 브라우저에서만 만들고 서버로 보내지 않습니다.",
    metaDescription:
      "비밀번호 생성기: 길이·문자 종류 선택, 암호 강도 조절, 로그인 없이 모바일에서.",
    keywords: ["비밀번호 생성기", "랜덤 비밀번호", "안전한 비번", "패스워드", "임시 비밀번호"],
    bodyText:
      "중요한 계정은 비밀번호 관리자와 2FA를 함께 사용하세요. 이 페이지는 생성값을 저장하지 않습니다.",
    relatedIntro: "난수 추첨·Base64와 같이 쓰면 데이터 작업 흐름이 이어집니다.",
    relatedSlugs: ["random-number", "base64", "url-encode", "json-format"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "길이(8~64)와 포함할 문자 종류를 고른 뒤「새로 생성」을 누릅니다. 복사해 서비스에 붙여 넣으세요.",
      },
      {
        title: "동작 기준",
        content:
          "가능하면 Web Crypto 수준의 난수를 쓰고, 선택한 종류에서 최소 한 글자씩 포함되도록 만든 뒤 순서를 섞습니다.",
      },
      {
        title: "예시",
        content: "16자, 네 종류 모두 켜기 → 길고 무작위한 비밀번호가 나옵니다.",
      },
      {
        title: "주의할 점",
        content: "생성 직후 화면을 벗어나면 같은 값을 다시 보여 주지 않을 수 있습니다. 필요하면 안전한 곳에 저장하세요.",
      },
    ],
    faq: [
      {
        question: "비밀번호가 서버에 가나요?",
        answer: "아니요. 브라우저에서만 생성합니다.",
      },
      {
        question: "특수문자가 사이트에서 안 먹어요.",
        answer: "일부 사이트는 허용 문자를 제한합니다. 기호를 끄거나 규칙에 맞게 고르세요.",
      },
      {
        question: "같은 비번이 또 나오나요?",
        answer: "무작위라 이론상 가능하지만 확률은 매우 낮습니다. 필요하면 다시 생성하세요.",
      },
      {
        question: "관리자가 복구해 주나요?",
        answer: "저장하지 않으므로 복구할 수 없습니다.",
      },
      {
        question: "한글 비밀번호는?",
        answer: "이 도구는 ASCII 문자 집합 위주입니다. 한글 비번은 서비스 정책을 확인하세요.",
      },
      {
        question: "2단계 인증은?",
        answer: "비밀번호와 별개로 OTP·앱 인증을 켜 두는 것이 안전합니다.",
      },
    ],
  },
  {
    slug: "random-number",
    categoryId: "utility",
    title: "난수 추첨기",
    shortTitle: "난수",
    seoTitle: "난수 생성기 | 범위 지정 추첨",
    ogDescription:
      "최소·최대와 개수를 정해 난수를 뽑습니다. 중복 없이 뽑기 옵션. 로그인 없이 모바일에서.",
    description: "정해진 범위에서 지정한 개수만큼 난수를 생성합니다. 중복 없이 뽑기를 지원합니다.",
    introText:
      "제비 뽑기·번호 정하기 등에 쓸 수 있는 참고용 도구입니다. 공정한 추첨이 법적으로 필요하면 공식 절차를 따르세요.",
    metaDescription:
      "난수 생성기: 최소~최대 범위, 개수, 중복 없이. 추첨·실험 참고, 모바일 즉시.",
    keywords: ["난수 생성기", "랜덤 숫자", "추첨", "제비 뽑기", "번호 뽑기"],
    bodyText:
      "도박·복권 등 법이 정한 절차가 있는 경우 이 도구로 대체할 수 없습니다.",
    relatedIntro: "비밀번호 생성·퍼센트 계산과 함께 쓰면 수·확률 작업이 편합니다.",
    relatedSlugs: ["password-generator", "percent", "dday", "date"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "최소·최대(정수), 개수를 넣고 중복 없이 뽑을지 선택한 뒤「추첨」을 누릅니다.",
      },
      {
        title: "동작 기준",
        content:
          "가능하면 암호학적 난수를 사용합니다. 중복 없이 뽑을 때는 범위 크기가 개수 이상이어야 합니다.",
      },
      {
        title: "예시",
        content: "1~45 중 6개, 중복 없음 → 로또 번호 연습용으로 숫자를 뽑아 볼 수 있습니다(실제 당첨과 무관).",
      },
      {
        title: "주의할 점",
        content: "통계·심리 실험 등 엄밀한 무작위가 필요하면 전문 도구를 쓰세요.",
      },
    ],
    faq: [
      {
        question: "진짜 무작위인가요?",
        answer: "브라우저 난수 생성기에 의존합니다. 엄밀한 용도는 전문 라이브러리를 검토하세요.",
      },
      {
        question: "소수는?",
        answer: "정수만 지원합니다.",
      },
      {
        question: "음수 범위도?",
        answer: "최소·최대에 음수를 넣을 수 있습니다.",
      },
      {
        question: "복권 당첨과 관련 있나요?",
        answer: "없습니다. 참고용 난수일 뿐입니다.",
      },
      {
        question: "결과를 저장하나요?",
        answer: "서버에 저장하지 않습니다.",
      },
      {
        question: "많이 뽑으면 느려요.",
        answer: "개수는 100개 이하로 제한했습니다.",
      },
    ],
  },
  {
    slug: "url-encode",
    categoryId: "text",
    title: "URL 인코딩·디코딩",
    shortTitle: "URL 인코드",
    seoTitle: "URL 인코더 | 퍼센트 인코딩 UTF-8",
    ogDescription:
      "한글·특수문자를 URL에 맞게 인코딩하거나 디코딩합니다. 브라우저에서만 처리.",
    description: "encodeURIComponent·decodeURIComponent로 문자열을 변환합니다.",
    introText:
      "쿼리 파라미터·경로 조각을 붙일 때 쓰는 도구입니다. 전체 URL 파싱은 브라우저와 서버마다 다를 수 있습니다.",
    metaDescription:
      "URL 인코더: UTF-8 퍼센트 인코딩·디코딩. 쿼리스트링용, 모바일 즉시, 로컬 처리.",
    keywords: ["URL 인코딩", "퍼센트 인코딩", "encodeURIComponent", "쿼리스트링", "한글 URL"],
    bodyText:
      "이스케이프 규칙은 RFC와 브라우저 구현에 따릅니다. API 연동은 서버 문서를 확인하세요.",
    relatedIntro: "Base64·JSON·공백 정리 도구와 연달아 쓰기 좋습니다.",
    relatedSlugs: ["base64", "json-format", "whitespace", "char-count"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "인코딩 모드에서는 원문을, 디코딩 모드에서는 %EC%98%81… 형태를 넣습니다.",
      },
      {
        title: "동작 기준",
        content:
          "JavaScript의 encodeURIComponent / decodeURIComponent와 같은 계열 동작을 목표로 합니다.",
      },
      {
        title: "예시",
        content: "‘한글’을 인코딩하면 %로 시작하는 이스케이프 시퀀스로 바뀝니다.",
      },
      {
        title: "주의할 점",
        content: "전체 URL을 통째로 넣으면 의도와 다를 수 있습니다. 필요한 조각만 넣으세요.",
      },
    ],
    faq: [
      {
        question: "encodeURI와 다른가요?",
        answer:
          "이 도구는 주로 쿼리 값에 맞는 encodeURIComponent 스타일을 다룹니다.",
      },
      {
        question: "공백은?",
        answer: "인코딩 시 %20으로 바뀝니다. + 기호 해석은 서버에 따라 다릅니다.",
      },
      {
        question: "디코딩이 깨져요.",
        answer: "잘린 문자열이나 잘못된 % 시퀀스면 실패할 수 있습니다.",
      },
      {
        question: "서버와 결과가 달라요.",
        answer: "언어·프레임워크별로 미세한 차이가 있을 수 있습니다.",
      },
      {
        question: "민감한 URL을 넣어도 되나요?",
        answer: "로컬 처리이지만 화면 공유 시 주의하세요.",
      },
      {
        question: "Base64와 차이는?",
        answer: "용도가 다릅니다. URL은 퍼센트 인코딩, Base64는 바이너리 텍스트 표현에 가깝습니다.",
      },
    ],
  },
  {
    slug: "base64",
    categoryId: "text",
    title: "Base64 인코딩·디코딩",
    shortTitle: "Base64",
    seoTitle: "Base64 인코더 | 텍스트 UTF-8",
    ogDescription:
      "텍스트를 Base64로 바꾸거나 UTF-8로 되돌립니다. 브라우저에서만 처리합니다.",
    description: "UTF-8 텍스트와 Base64 문자열을 서로 변환합니다.",
    introText:
      "간단한 데이터 인코딩·디버깅에 쓸 수 있습니다. 바이너리 파일 대용량 처리는 권장하지 않습니다.",
    metaDescription:
      "Base64 인코더: UTF-8 텍스트 ↔ Base64. 개발·메모용, 모바일 즉시, 로컬 처리.",
    keywords: ["Base64", "베이스64", "텍스트 인코딩", "UTF-8 Base64", "디코딩"],
    bodyText:
      "Base64는 암호화가 아닙니다. 민감 정보는 암호화·비밀 관리 도구를 사용하세요.",
    relatedIntro: "URL 인코딩·JSON과 함께 쓰면 API·로그 작업이 편합니다.",
    relatedSlugs: ["url-encode", "json-format", "char-count", "whitespace"],
    toolSections: [
      {
        title: "어떻게 쓰나요?",
        content:
          "텍스트→Base64 모드에서 일반 글을 넣거나, Base64→텍스트 모드에서 인코딩된 문자열을 넣습니다.",
      },
      {
        title: "동작 기준",
        content:
          "UTF-8 바이트를 Base64로 변환합니다. 디코딩 시 잘못된 패드·문자면 오류가 납니다.",
      },
      {
        title: "예시",
        content: "‘hello’를 인코딩하면 영문 Base64 문자열이 나옵니다.",
      },
      {
        title: "주의할 점",
        content: "아주 긴 텍스트는 브라우저가 느려질 수 있습니다.",
      },
    ],
    faq: [
      {
        question: "암호화되나요?",
        answer: "아니요. 누구나 디코딩할 수 있는 인코딩입니다.",
      },
      {
        question: "한글은?",
        answer: "UTF-8로 처리합니다.",
      },
      {
        question: "이미지 파일은?",
        answer: "이 페이지는 텍스트 위주입니다. 파일은 드래그 업로드형 도구를 쓰는 편이 낫습니다.",
      },
      {
        question: "줄바꿈이 들어가나요?",
        answer: "입력에 따라 달라집니다. 필요하면 줄바꿈을 제거해 보세요.",
      },
      {
        question: "URL 안전 Base64는?",
        answer: "표준 Base64와 패딩 규칙이 다를 수 있습니다. API 스펙을 확인하세요.",
      },
      {
        question: "디코딩이 실패해요.",
        answer: "잘못된 문자·패딩·잘린 데이터일 수 있습니다. 원문을 다시 확인하세요.",
      },
    ],
  },
];
