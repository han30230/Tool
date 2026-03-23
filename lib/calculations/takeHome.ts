/**
 * 참고용 실수령액(세후 월급) 간이 추정.
 * 4대보험은 대표 요율·상한(국민연금·고용 상한 월액)을 반영하고,
 * 소득세·지방소득세는 과세표준에 누진세율을 적용한 단순 모델입니다.
 * 회사별 공제·비과세·간이세액표·연말정산과 다를 수 있습니다.
 */

const NP_CAP_MONTHLY = 5_900_000; // 대표 상한(연도별로 변동)
const NP_RATE = 0.045;
const HI_RATE = 0.03545;
const LTC_OF_HI = 0.1295; // 건강보험료 대비 장기요양
const EI_RATE = 0.009;
const EI_CAP_MONTHLY = 5_900_000;

/** 연간 과세표준에 대한 누진세(간이, 2024년 근로소득 누진 구조 참고) */
function progressiveAnnualTax(annualTaxable: number): number {
  const x = Math.max(0, Math.floor(annualTaxable));
  if (x <= 12_000_000) return Math.floor(x * 0.06);
  if (x <= 46_000_000) return Math.floor(x * 0.15 - 1_080_000);
  if (x <= 88_000_000) return Math.floor(x * 0.24 - 5_220_000);
  if (x <= 150_000_000) return Math.floor(x * 0.35 - 14_900_000);
  if (x <= 300_000_000) return Math.floor(x * 0.38 - 19_400_000);
  if (x <= 500_000_000) return Math.floor(x * 0.4 - 25_400_000);
  if (x <= 1_000_000_000) return Math.floor(x * 0.42 - 35_400_000);
  return Math.floor(x * 0.45 - 65_400_000);
}

export type TakeHomeInput = {
  /** 세전 연봉 또는 세전 월급 */
  grossAmount: number;
  mode: "annual" | "monthly";
  /** 부양가족 수(본인 제외, 0~7) */
  dependents: number;
  /** 월 비과세액(식대 등 합산을 단순 입력) */
  nontaxableMonthly: number;
};

export type TakeHomeBreakdown = {
  grossMonthly: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTaxMonthly: number;
  localTaxMonthly: number;
  netMonthly: number;
  /** 연간 과세표준(간이) */
  annualTaxableForDisplay: number;
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function calculateTakeHome(input: TakeHomeInput): TakeHomeBreakdown | null {
  const { grossAmount, mode, dependents, nontaxableMonthly } = input;
  if (!Number.isFinite(grossAmount) || grossAmount <= 0) return null;

  const grossMonthly =
    mode === "annual" ? Math.round(grossAmount / 12) : Math.round(grossAmount);

  const dep = clamp(Math.floor(dependents), 0, 7);
  const nonTax = Math.max(0, nontaxableMonthly);

  const baseNp = Math.min(grossMonthly, NP_CAP_MONTHLY);
  const nationalPension = Math.round(baseNp * NP_RATE);

  const healthInsurance = Math.round(grossMonthly * HI_RATE);
  const longTermCare = Math.round(healthInsurance * LTC_OF_HI);

  const baseEi = Math.min(grossMonthly, EI_CAP_MONTHLY);
  const employmentInsurance = Math.round(baseEi * EI_RATE);

  const insuranceMonthly =
    nationalPension + healthInsurance + longTermCare + employmentInsurance;

  /** 간이 과세표준(연): 급여연간 − 4대보험 연간 − 기본공제 − 부양가족공제 − 비과세연간 */
  const annualGross = grossMonthly * 12;
  const annualInsurance = insuranceMonthly * 12;
  const basicDeduction = 1_500_000;
  const dependentDeduction = dep * 1_500_000;
  const nontaxAnnual = nonTax * 12;

  const annualTaxable = Math.max(
    0,
    annualGross - annualInsurance - basicDeduction - dependentDeduction - nontaxAnnual,
  );

  const annualTax = progressiveAnnualTax(annualTaxable);
  const incomeTaxMonthly = Math.round(annualTax / 12);
  const localTaxMonthly = Math.round(incomeTaxMonthly * 0.1);

  const netMonthly =
    grossMonthly -
    insuranceMonthly -
    incomeTaxMonthly -
    localTaxMonthly;

  return {
    grossMonthly,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTaxMonthly,
    localTaxMonthly,
    netMonthly: Math.round(netMonthly),
    annualTaxableForDisplay: annualTaxable,
  };
}
