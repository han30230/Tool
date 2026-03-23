"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}";

function randomInt(max: number): number {
  if (max <= 0) return 0;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! % max;
  }
  return Math.floor(Math.random() * max);
}

function pickFrom(pool: string): string {
  return pool[randomInt(pool.length)] ?? "";
}

function shuffleInPlace(arr: string[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const a = arr[i];
    const b = arr[j];
    if (a !== undefined && b !== undefined) {
      arr[i] = b;
      arr[j] = a;
    }
  }
}

function generatePassword(
  length: number,
  useLower: boolean,
  useUpper: boolean,
  useDigits: boolean,
  useSymbols: boolean,
): string | null {
  const pools: string[] = [];
  const required: string[] = [];
  if (useLower) {
    pools.push(LOWER);
    required.push(pickFrom(LOWER));
  }
  if (useUpper) {
    pools.push(UPPER);
    required.push(pickFrom(UPPER));
  }
  if (useDigits) {
    pools.push(DIGITS);
    required.push(pickFrom(DIGITS));
  }
  if (useSymbols) {
    pools.push(SYMBOLS);
    required.push(pickFrom(SYMBOLS));
  }
  if (pools.length === 0) return null;
  const all = pools.join("");
  const need = Math.max(length, required.length);
  const chars = [...required];
  while (chars.length < need) {
    chars.push(pickFrom(all));
  }
  shuffleInPlace(chars);
  return chars.slice(0, length).join("");
}

type PasswordGeneratorToolProps = { tool: ResolvedTool };

export function PasswordGeneratorTool({ tool }: PasswordGeneratorToolProps) {
  const [len, setLen] = useState("16");
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [pwd, setPwd] = useState("");

  const lengthNum = useMemo(() => {
    const n = parseInt(len.replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  }, [len]);

  const err = useMemo(() => {
    if (lengthNum === null || lengthNum < 8 || lengthNum > 64) return "길이는 8~64 사이로 입력하세요.";
    if (!lower && !upper && !digits && !symbols) return "문자 종류를 하나 이상 선택하세요.";
    return undefined;
  }, [lengthNum, lower, upper, digits, symbols]);

  const regenerate = useCallback(() => {
    if (err || lengthNum === null) return;
    const p = generatePassword(lengthNum, lower, upper, digits, symbols);
    setPwd(p ?? "");
  }, [err, lengthNum, lower, upper, digits, symbols]);

  const handleReset = useCallback(() => {
    setLen("16");
    setLower(true);
    setUpper(true);
    setDigits(true);
    setSymbols(true);
    setPwd("");
  }, []);

  const handleExample = useCallback(() => {
    setLen("16");
    setLower(true);
    setUpper(true);
    setDigits(true);
    setSymbols(true);
    const p = generatePassword(16, true, true, true, true);
    setPwd(p ?? "");
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="길이"
            value={len}
            onChange={(e) => setLen(e.target.value)}
            inputMode="numeric"
            min={8}
            max={64}
          />
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-[var(--foreground)]">포함할 문자</legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={lower}
                onChange={(e) => setLower(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              소문자
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={upper}
                onChange={(e) => setUpper(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              대문자
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={digits}
                onChange={(e) => setDigits(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              숫자
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              기호
            </label>
          </fieldset>
          <button
            type="button"
            onClick={regenerate}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition hover:opacity-95"
          >
            새로 생성
          </button>
          {err ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {err}
            </p>
          ) : null}
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        pwd && !err ? (
          <ResultCard
            primaryLabel="생성된 비밀번호"
            primaryValue={pwd}
            copyText={pwd}
            description="중요한 계정은 비밀번호 관리자와 2단계 인증을 함께 쓰세요. 이 페이지는 저장하지 않습니다."
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-inner)]/50 p-6 text-sm text-[var(--muted)]">
            옵션을 고른 뒤「새로 생성」을 누르세요.
          </div>
        )
      }
    />
  );
}
