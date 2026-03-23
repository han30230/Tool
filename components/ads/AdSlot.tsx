"use client";

import { useEffect, useRef, useState } from "react";

export type AdSlotVariant =
  | "home"
  | "top"
  | "between"
  | "midGuide"
  | "inline"
  | "footer"
  | "belowRelated"
  | "floatingLeft"
  | "floatingRight";

type AdSlotProps = {
  variant: AdSlotVariant;
  className?: string;
};

declare global {
  interface Window {
    PartnersCoupang?: {
      G: new (config: {
        id: number;
        trackingCode: string;
        subId: string | null;
        template: "carousel" | "banner";
        width: string;
        height: string;
      }) => unknown;
    };
  }
}

/** 슬롯별 최소 높이( CLS 완화 ) */
const MIN_HEIGHT: Record<AdSlotVariant, string> = {
  home: "min-h-[120px]",
  top: "min-h-[250px]",
  between: "min-h-[250px]",
  midGuide: "min-h-[280px]",
  inline: "min-h-[280px]",
  footer: "min-h-[120px]",
  belowRelated: "min-h-[120px]",
  floatingLeft: "min-h-[600px]",
  floatingRight: "min-h-[600px]",
};

function getCoupangConfig(variant: AdSlotVariant): {
  width: string;
  height: string;
  template: "carousel" | "banner";
} {
  switch (variant) {
    case "floatingLeft":
    case "floatingRight":
      return { width: "160", height: "600", template: "banner" };
    default:
      return { width: "680", height: "140", template: "carousel" };
  }
}

/** 쿠팡 파트너스 슬롯 렌더 */
export function AdSlot({ variant, className = "" }: AdSlotProps) {
  const isBottomStackVariant = variant === "footer" || variant === "belowRelated";
  const isFloating =
    variant === "floatingLeft" ||
    variant === "floatingRight";

  const coupangRef = useRef<HTMLDivElement | null>(null);
  const coupangInitializedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const config = getCoupangConfig(variant);

  useEffect(() => {
    if (!coupangRef.current || coupangInitializedRef.current) return;
    const mountAd = () => {
      if (!coupangRef.current || coupangInitializedRef.current) return false;
      if (!window.PartnersCoupang?.G) return false;
      const script = document.createElement("script");
      script.text =
        `new PartnersCoupang.G({"id":973392,"trackingCode":"AF9001367","subId":null,"template":"${config.template}","width":"${config.width}","height":"${config.height}"});`;
      coupangRef.current.appendChild(script);
      coupangInitializedRef.current = true;
      setReady(true);
      return true;
    };
    if (mountAd()) return;
    const t = window.setInterval(() => {
      if (mountAd()) window.clearInterval(t);
    }, 250);
    return () => window.clearInterval(t);
  }, [config.height, config.template, config.width]);

  const reserve = MIN_HEIGHT[variant];
  if (isBottomStackVariant) return null;

  return (
    <aside
      className={`w-full overflow-hidden ${reserve} ${className}`}
      aria-label="광고"
      data-ad-variant={variant}
    >
      <div
        className={`flex w-full items-center ${
          isFloating ? "justify-center" : "justify-center"
        }`}
      >
        <div ref={coupangRef} />
      </div>
      {!ready ? (
        <div
          className={`flex w-full items-center justify-center rounded-2xl border border-dashed border-[var(--accent)]/20 bg-[var(--card-inner)]/80 text-sm font-medium text-[var(--muted)] ${reserve}`}
          aria-label="광고 영역(예약)"
        >
          <span aria-hidden>광고 영역</span>
        </div>
      ) : null}
    </aside>
  );
}
