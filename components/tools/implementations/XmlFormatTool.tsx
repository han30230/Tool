"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { formatXmlMinify, formatXmlPretty } from "@/lib/xml/formatXml";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item id="1">안녕</item>
  <item id="2">XML</item>
</root>`;

type XmlFormatToolProps = { tool: ResolvedTool };

export function XmlFormatTool({ tool }: XmlFormatToolProps) {
  const [raw, setRaw] = useState(SAMPLE);

  const result = useMemo(() => {
    const t = raw.trim();
    if (!t) return { ok: false as const, message: "" };
    try {
      const pretty = formatXmlPretty(raw);
      const minify = formatXmlMinify(raw);
      return { ok: true as const, pretty, minify };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "처리할 수 없습니다.";
      return { ok: false as const, message: msg };
    }
  }, [raw]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormTextarea
            label="XML 입력"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
            helperText="선언부·루트 요소가 있는 형태를 권장합니다. 브라우저 DOMParser로 파싱합니다."
          />
          <ToolActionBar
            onReset={() => setRaw("")}
            onExample={() => setRaw(SAMPLE)}
          />
        </div>
      }
      resultSlot={
        result.ok ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <XmlBlock title="포맷 (들여쓰기)" value={result.pretty} onCopy={() => copy(result.pretty)} />
            <XmlBlock title="한 줄 (minify)" value={result.minify} onCopy={() => copy(result.minify)} />
          </div>
        ) : result.message ? (
          <div
            className="rounded-xl border border-red-500/40 bg-[var(--card)] p-5 text-sm text-red-700 dark:text-red-300"
            role="alert"
          >
            <p className="font-medium">XML을 처리할 수 없습니다</p>
            <p className="mt-2 leading-relaxed">{result.message}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            XML을 입력하세요.
          </div>
        )
      }
    />
  );
}

function XmlBlock({
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
