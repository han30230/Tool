"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from "@/lib/color/conversions";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type Rgb = { r: number; g: number; b: number };

const DEFAULT: Rgb = { r: 79, g: 70, b: 229 };

type ColorConverterToolProps = { tool: ResolvedTool };

export function ColorConverterTool({ tool }: ColorConverterToolProps) {
  const [rgb, setRgb] = useState<Rgb>(DEFAULT);

  const hex = useMemo(() => rgbToHex(rgb.r, rgb.g, rgb.b), [rgb]);

  const [hexInput, setHexInput] = useState(hex);
  useEffect(() => {
    setHexInput(hex);
  }, [hex]);

  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  const setFromHsl = useCallback((h: number, s: number, l: number) => {
    setRgb(hslToRgb(h, s, l));
  }, []);

  const copyText = useMemo(
    () =>
      [
        hex,
        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      ].join("\n"),
    [hex, rgb, hsl],
  );

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-5">
          <p className="text-xs text-[var(--muted)]">
            색상 피커·HEX·RGB·HSL을 서로 맞춥니다. 입력은 브라우저에서만 처리됩니다.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              <span>피커</span>
              <input
                type="color"
                value={hex}
                onChange={(e) => {
                  const p = hexToRgb(e.target.value);
                  if (p) setRgb(p);
                }}
                className="h-12 w-20 cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--card)]"
                aria-label="색상 피커"
              />
            </label>
            <div
              className="min-h-[48px] min-w-[120px] flex-1 rounded-xl border border-[var(--border)] shadow-inner"
              style={{ backgroundColor: hex }}
              aria-label="색 미리보기"
            />
          </div>
          <FormField
            label="HEX (#RRGGBB)"
            value={hexInput}
            onChange={(e) => {
              const v = e.target.value;
              setHexInput(v);
              const normalized = v.trim().startsWith("#") ? v.trim() : `#${v.trim()}`;
              const parsed = hexToRgb(normalized);
              if (parsed) setRgb(parsed);
            }}
            onBlur={() => {
              const parsed = hexToRgb(hexInput.trim().startsWith("#") ? hexInput.trim() : `#${hexInput.trim()}`);
              if (!parsed) setHexInput(hex);
            }}
            placeholder="#4f46e5"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <FormField
              label="R (0–255)"
              value={String(rgb.r)}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/\D/g, ""));
                if (Number.isFinite(n)) setRgb((prev) => ({ ...prev, r: Math.min(255, Math.max(0, n)) }));
              }}
              inputMode="numeric"
            />
            <FormField
              label="G (0–255)"
              value={String(rgb.g)}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/\D/g, ""));
                if (Number.isFinite(n)) setRgb((prev) => ({ ...prev, g: Math.min(255, Math.max(0, n)) }));
              }}
              inputMode="numeric"
            />
            <FormField
              label="B (0–255)"
              value={String(rgb.b)}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/\D/g, ""));
                if (Number.isFinite(n)) setRgb((prev) => ({ ...prev, b: Math.min(255, Math.max(0, n)) }));
              }}
              inputMode="numeric"
            />
          </div>
          <fieldset className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--card-inner)] p-4">
            <legend className="text-sm font-semibold text-[var(--foreground)]">HSL</legend>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="hsl-h" className="mb-1 block text-xs font-medium text-[var(--muted)]">
                  H (0–360)
                </label>
                <input
                  id="hsl-h"
                  type="range"
                  min={0}
                  max={360}
                  value={hsl.h}
                  onChange={(e) =>
                    setFromHsl(Number(e.target.value), hsl.s, hsl.l)
                  }
                  className="w-full accent-[var(--accent)]"
                />
                <p className="mt-1 text-center text-xs tabular-nums text-[var(--foreground)]">{hsl.h}°</p>
              </div>
              <div>
                <label htmlFor="hsl-s" className="mb-1 block text-xs font-medium text-[var(--muted)]">
                  S (0–100%)
                </label>
                <input
                  id="hsl-s"
                  type="range"
                  min={0}
                  max={100}
                  value={hsl.s}
                  onChange={(e) =>
                    setFromHsl(hsl.h, Number(e.target.value), hsl.l)
                  }
                  className="w-full accent-[var(--accent)]"
                />
                <p className="mt-1 text-center text-xs tabular-nums text-[var(--foreground)]">{hsl.s}%</p>
              </div>
              <div>
                <label htmlFor="hsl-l" className="mb-1 block text-xs font-medium text-[var(--muted)]">
                  L (0–100%)
                </label>
                <input
                  id="hsl-l"
                  type="range"
                  min={0}
                  max={100}
                  value={hsl.l}
                  onChange={(e) =>
                    setFromHsl(hsl.h, hsl.s, Number(e.target.value))
                  }
                  className="w-full accent-[var(--accent)]"
                />
                <p className="mt-1 text-center text-xs tabular-nums text-[var(--foreground)]">{hsl.l}%</p>
              </div>
            </div>
          </fieldset>
          <ToolActionBar
            onReset={() => setRgb(DEFAULT)}
            onExample={() => setRgb({ r: 16, g: 185, b: 129 })}
          />
        </div>
      }
      resultSlot={
        <ResultCard
          primaryLabel="HEX"
          primaryValue={hex}
          copyText={copyText}
          description={`RGB rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) · HSL hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
        />
      }
    />
  );
}
