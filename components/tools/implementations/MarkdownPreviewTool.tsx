"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCallback, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const EXAMPLE = `# 제목

- 목록 **굵게**
- \`코드\`

| 열1 | 열2 |
| --- | --- |
| a | b |

\`\`\`js
console.log("hello");
\`\`\`
`;

const previewClass =
  "min-h-[200px] rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm leading-relaxed text-[var(--foreground)] shadow-[var(--shadow-sm)] [&_a]:text-[var(--accent)] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--border-strong)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--muted)] [&_code]:rounded [&_code]:bg-[var(--card-inner)] [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em] [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[var(--card-inner)] [&_pre]:p-3 [&_pre]:font-mono [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[var(--border)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--border)] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-6";

type MarkdownPreviewToolProps = { tool: ResolvedTool };

export function MarkdownPreviewTool({ tool }: MarkdownPreviewToolProps) {
  const [raw, setRaw] = useState(EXAMPLE);

  const copyMd = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(raw);
    } catch {
      /* ignore */
    }
  }, [raw]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">입력은 기기 안에서만 처리됩니다.</p>
          <FormTextarea
            label="Markdown"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[220px] font-mono text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyMd}
              className="min-h-[44px] rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)]"
            >
              Markdown 복사
            </button>
          </div>
          <ToolActionBar onReset={() => setRaw("")} onExample={() => setRaw(EXAMPLE)} />
        </div>
      }
      resultSlot={
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">미리보기</p>
          <div className={previewClass}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{raw}</ReactMarkdown>
          </div>
        </div>
      }
    />
  );
}
