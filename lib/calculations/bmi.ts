/** BMI = 체중(kg) / 키(m)². 참고용. */

export type BmiResult = {
  bmi: number;
  category: "저체중" | "정상" | "과체중" | "비만";
};

export function calculateBmi(heightCm: number, weightKg: number): BmiResult | null {
  if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) return null;
  if (heightCm <= 0 || weightKg <= 0) return null;
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  if (!Number.isFinite(bmi)) return null;
  const rounded = Math.round(bmi * 10) / 10;
  let category: BmiResult["category"];
  if (rounded < 18.5) category = "저체중";
  else if (rounded < 23) category = "정상";
  else if (rounded < 25) category = "과체중";
  else category = "비만";
  return { bmi: rounded, category };
}
