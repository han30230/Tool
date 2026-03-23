/** 인치 ↔ cm (국제 인치 2.54cm) */
export const INCH_TO_CM = 2.54;

export function inchToCm(inch: number): number {
  return inch * INCH_TO_CM;
}

export function cmToInch(cm: number): number {
  return cm / INCH_TO_CM;
}

/** kg ↔ lb */
export const KG_TO_LB = 2.2046226218;

export function kgToLb(kg: number): number {
  return kg * KG_TO_LB;
}

export function lbToKg(lb: number): number {
  return lb / KG_TO_LB;
}

/** 섭씨 ↔ 화씨 */
export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

/** 1024 기준 바이트 단위 (IEC Ki, Mi, Gi, Ti) */
export type DataUnit = "b" | "kb" | "mb" | "gb" | "tb";

const UNIT_STEPS: { id: DataUnit; label: string; pow: number }[] = [
  { id: "b", label: "B", pow: 0 },
  { id: "kb", label: "KB", pow: 1 },
  { id: "mb", label: "MB", pow: 2 },
  { id: "gb", label: "GB", pow: 3 },
  { id: "tb", label: "TB", pow: 4 },
];

const BASE = 1024;

export function bytesFromUnit(value: number, unit: DataUnit): number {
  const row = UNIT_STEPS.find((u) => u.id === unit);
  if (!row) return value;
  return value * BASE ** row.pow;
}

export function bytesToUnit(bytes: number, unit: DataUnit): number {
  const row = UNIT_STEPS.find((u) => u.id === unit);
  if (!row) return bytes;
  return bytes / BASE ** row.pow;
}

export function convertDataUnits(value: number, from: DataUnit, to: DataUnit): number {
  const b = bytesFromUnit(value, from);
  return bytesToUnit(b, to);
}

export { UNIT_STEPS };
