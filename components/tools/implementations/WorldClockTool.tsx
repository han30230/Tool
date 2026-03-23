"use client";

import { useEffect, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { ResultCard } from "@/components/tool-page/ResultCard";

const ZONES: { id: string; label: string }[] = [
  { id: "Asia/Seoul", label: "서울" },
  { id: "Asia/Tokyo", label: "도쿄" },
  { id: "Asia/Shanghai", label: "상하이" },
  { id: "Asia/Singapore", label: "싱가포르" },
  { id: "Europe/London", label: "런던" },
  { id: "Europe/Paris", label: "파리" },
  { id: "America/New_York", label: "뉴욕" },
  { id: "America/Los_Angeles", label: "LA" },
  { id: "Australia/Sydney", label: "시드니" },
];

function formatTime(zone: string, now: Date): string {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: zone,
      weekday: "short",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);
  } catch {
    return "—";
  }
}

type WorldClockToolProps = { tool: ResolvedTool };

export function WorldClockTool({ tool }: WorldClockToolProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const rows = useMemo(
    () =>
      ZONES.map((z) => ({
        ...z,
        time: formatTime(z.id, now),
      })),
    [now],
  );

  const copyText = rows.map((r) => `${r.label}: ${r.time}`).join("\n");

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <p className="text-sm text-[var(--muted)]">
          브라우저 기준 현재 시각을 여러 도시 시간대로 표시합니다. 서머타임·정책 변경은 반영되지 않을 수 있습니다.
        </p>
      }
      resultSlot={
        <ResultCard
          primaryLabel="서울 기준"
          primaryValue={rows[0]?.time ?? "—"}
          copyText={copyText}
          description="1초마다 갱신됩니다."
          extraRows={rows.slice(1).map((r) => ({ label: r.label, value: r.time }))}
        />
      }
    />
  );
}
