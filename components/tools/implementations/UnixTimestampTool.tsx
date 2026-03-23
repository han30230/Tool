"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const fmt = (d: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(d);

type UnixTimestampToolProps = { tool: ResolvedTool };

export function UnixTimestampTool({ tool }: UnixTimestampToolProps) {
  const [raw, setRaw] = useState("");

  const parsed = useMemo(() => {
    const t = raw.trim();
    if (t === "") return null;
    if (/^-?\d+$/.test(t)) {
      const num = parseInt(t, 10);
      if (!Number.isFinite(num)) return { kind: "err" as const, msg: "숫자를 확인하세요." };
      const ms = num < 1e12 ? num * 1000 : num;
      const d = new Date(ms);
      if (Number.isNaN(d.getTime())) return { kind: "err" as const, msg: "유효한 시간이 아닙니다." };
      return { kind: "ok" as const, d, unixSec: Math.floor(ms / 1000) };
    }
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return { kind: "err" as const, msg: "날짜를 파싱할 수 없습니다." };
    return { kind: "ok" as const, d, unixSec: Math.floor(d.getTime() / 1000) };
  }, [raw]);

  const display = useMemo(() => {
    if (parsed?.kind === "ok") return fmt(parsed.d);
    if (parsed?.kind === "err") return parsed.msg;
    return "";
  }, [parsed]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormField
            label="Unix 초(또는 ms) 또는 날짜 문자열"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="1735123456 또는 2025-01-01"
            helperText="숫자만 넣으면 초(ms 자릿수로 자동 추정)로 해석합니다."
          />
          <ToolActionBar onReset={() => setRaw("")} onExample={() => setRaw(String(Math.floor(Date.now() / 1000)))} />
        </div>
      }
      resultSlot={
        parsed?.kind === "ok" ? (
          <ResultCard
            primaryLabel="로컬 표시"
            primaryValue={display}
            copyText={`${parsed.unixSec}`}
            description="타임존은 브라우저 로컬입니다."
            extraRows={[{ label: "Unix 초", value: String(parsed.unixSec) }]}
          />
        ) : parsed?.kind === "err" ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-800 dark:text-amber-200">
            {parsed.msg}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            숫자 또는 날짜 문자열을 입력하세요.
          </div>
        )
      }
    />
  );
}
