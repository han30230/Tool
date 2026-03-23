"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { buildLorem } from "@/lib/text/lorem";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type LoremIpsumToolProps = { tool: ResolvedTool };

export function LoremIpsumTool({ tool }: LoremIpsumToolProps) {
  const [p, setP] = useState("3");
  const [s, setS] = useState("4");

  const text = useMemo(() => {
    const pi = parseInt(p.replace(/\D/g, ""), 10);
    const si = parseInt(s.replace(/\D/g, ""), 10);
    return buildLorem(Number.isFinite(pi) ? pi : 3, Number.isFinite(si) ? si : 4);
  }, [p, s]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField label="문단 수" value={p} onChange={(e) => setP(e.target.value)} inputMode="numeric" />
          <FormField label="문단당 문장 수" value={s} onChange={(e) => setS(e.target.value)} inputMode="numeric" />
          <ToolActionBar onReset={() => { setP("3"); setS("4"); }} onExample={() => { setP("2"); setS("3"); }} />
        </div>
      }
      resultSlot={
        <div className="space-y-3">
          <FormTextarea label="결과" value={text} readOnly className="min-h-[200px] text-sm leading-relaxed" />
        </div>
      }
    />
  );
}
