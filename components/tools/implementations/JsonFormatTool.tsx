"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatJsonString } from "@/lib/calculations/jsonFormat";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const SAMPLE = '{"name":"툴모음","items":[1,2,3],"ok":true}';

type JsonFormatToolProps = {
  tool: ResolvedTool;
};

export function JsonFormatTool({ tool }: JsonFormatToolProps) {
  const [raw, setRaw] = useState(SAMPLE);

  const parsed = useMemo(() => formatJsonString(raw), [raw]);

  const handleReset = useCallback(() => {
    setRaw("");
  }, []);

  const handleExample = useCallback(() => {
    setRaw(SAMPLE);
  }, []);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }, []);

  const usageSlot = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        사용 방법
      </summary>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--muted)]">
        <li>JSON 문자열을 붙여 넣으면 포맷(들여쓰기)과 한 줄(minify)을 동시에 만듭니다.</li>
        <li>오류가 나면 브라우저가 알려 주는 메시지를 그대로 보여 주니, 따옴표·쉼표를 점검해 보세요.</li>
        <li>처리는 기기 안에서만 이루어집니다.</li>
      </ul>
    </details>
  );

  return (
    <ToolPageLayout
      tool={tool}
      usageSlot={usageSlot}
      inputSlot={
        <div className="space-y-4">
          <FormTextarea
            label="JSON 입력"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="font-mono text-sm"
            helperText="객체·배열 모두 가능합니다. 입력이 바뀔 때마다 아래 결과가 갱신됩니다."
          />
          <ToolActionBar onReset={handleReset} onExample={handleExample} />
        </div>
      }
      resultSlot={
        parsed.ok ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <JsonBlock
              title="포맷 (들여쓰기)"
              value={parsed.pretty}
              onCopy={() => copy(parsed.pretty)}
            />
            <JsonBlock
              title="Minify (한 줄)"
              value={parsed.minify}
              onCopy={() => copy(parsed.minify)}
            />
          </div>
        ) : (
          <div
            className="rounded-xl border border-red-500/40 bg-[var(--card)] p-5 text-sm text-red-700 dark:text-red-300"
            role="alert"
          >
            <p className="font-medium">JSON을 처리할 수 없습니다</p>
            <p className="mt-2 leading-relaxed">{parsed.message}</p>
          </div>
        )
      }
    />
  );
}

function JsonBlock({
  title,
  value,
  onCopy,
}: {
  title: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-[var(--foreground)]">{title}</h3>
        <button
          type="button"
          onClick={onCopy}
          className="min-h-[40px] shrink-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          복사
        </button>
      </div>
      <textarea
        readOnly
        value={value}
        className="mt-3 w-full min-h-[220px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 font-mono text-xs text-[var(--foreground)] sm:text-sm"
        spellCheck={false}
        aria-label={title}
      />
    </div>
  );
}
