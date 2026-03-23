"use client";

import { useEffect, useRef } from "react";

export type AdSlotVariant =
  | "home"
  | "top"
  | "between"
  | "midGuide"
  | "inline"
  | "footer"
  | "belowRelated";

type AdSlotProps = {
  variant: AdSlotVariant;
  className?: string;
};

/**
 * 슬롯별 최소 높이( CLS 완화 ). 실제 광고 단위 크기에 맞춰 env로 조정 가능.
 */
const MIN_HEIGHT: Record<AdSlotVariant, string> = {
  home: "min-h-[120px]",
  top: "min-h-[250px]",
  between: "min-h-[250px]",
  midGuide: "min-h-[280px]",
  inline: "min-h-[280px]",
  footer: "min-h-[120px]",
  belowRelated: "min-h-[120px]",
};

function resolveSlot(variant: AdSlotVariant): string | undefined {
  const e = process.env;
  switch (variant) {
    case "home":
      return (
        e.NEXT_PUBLIC_ADSENSE_SLOT_HOME ??
        e.NEXT_PUBLIC_ADSENSE_SLOT_INLINE ??
        e.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER
      );
    case "top":
      return (
        e.NEXT_PUBLIC_ADSENSE_SLOT_TOP ??
        e.NEXT_PUBLIC_ADSENSE_SLOT_INLINE ??
        e.NEXT_PUBLIC_ADSENSE_SLOT_BETWEEN
      );
    case "between":
      return (
        e.NEXT_PUBLIC_ADSENSE_SLOT_BETWEEN ?? e.NEXT_PUBLIC_ADSENSE_SLOT_INLINE
      );
    case "midGuide":
      return (
        e.NEXT_PUBLIC_ADSENSE_SLOT_MID_GUIDE ??
        e.NEXT_PUBLIC_ADSENSE_SLOT_INLINE
      );
    case "inline":
      return e.NEXT_PUBLIC_ADSENSE_SLOT_INLINE;
    case "footer":
      return (
        e.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? e.NEXT_PUBLIC_ADSENSE_SLOT_INLINE
      );
    case "belowRelated":
      return (
        e.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_RELATED ??
        e.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ??
        e.NEXT_PUBLIC_ADSENSE_SLOT_INLINE
      );
    default:
      return e.NEXT_PUBLIC_ADSENSE_SLOT_INLINE;
  }
}

function minHeightPx(variant: AdSlotVariant): number {
  switch (variant) {
    case "home":
      return 120;
    case "top":
    case "between":
      return 250;
    case "midGuide":
    case "inline":
      return 280;
    case "footer":
    case "belowRelated":
      return 120;
    default:
      return 250;
  }
}

/**
 * Google AdSense: 예약 높이 + lazyOnload 스크립트( layout.tsx )와 함께 CLS 완화.
 * 클라이언트: ins 삽입 후 adsbygoogle.push.
 */
export function AdSlot({ variant, className = "" }: AdSlotProps) {
  const insRef = useRef<HTMLModElement | null>(null);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slot = resolveSlot(variant);

  useEffect(() => {
    if (!client || !slot || !insRef.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* ignore */
    }
  }, [client, slot]);

  const reserve = MIN_HEIGHT[variant];

  if (!client || !slot) {
    return (
      <aside
        className={`flex w-full items-center justify-center rounded-2xl border border-dashed border-[var(--accent)]/20 bg-[var(--card-inner)]/80 text-sm font-medium text-[var(--muted)] ${reserve} ${className}`}
        aria-label="광고 영역(예약)"
        data-ad-placeholder={variant}
      >
        <span aria-hidden>광고 영역</span>
      </aside>
    );
  }

  return (
    <aside
      className={`w-full overflow-hidden ${reserve} ${className}`}
      aria-label="광고"
      data-ad-variant={variant}
    >
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{
          display: "block",
          minHeight: minHeightPx(variant),
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
