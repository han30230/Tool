"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { decodeJwtParts } from "@/lib/jwt/decodeJwt";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

type JwtDecoderToolProps = { tool: ResolvedTool };

export function JwtDecoderTool({ tool }: JwtDecoderToolProps) {
  const [raw, setRaw] = useState("");

  const decoded = useMemo(() => decodeJwtParts(raw), [raw]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }, []);

  const combinedCopy = useMemo(() => {
    if (!decoded.ok) return "";
    return [`// header`, decoded.headerJson, ``, `// payload`, decoded.payloadJson].join("\n");
  }, [decoded]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            서명 검증은 하지 않습니다. 헤더·페이로드를 Base64url 디코딩해 JSON으로만 보여 줍니다. 민감한 토큰은
            사용 후 지우세요.
          </p>
          <FormTextarea
            label="JWT 문자열"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />
          <ToolActionBar onReset={() => setRaw("")} onExample={() => setRaw(SAMPLE_JWT)} />
        </div>
      }
      resultSlot={
        decoded.ok ? (
          <div className="space-y-6">
            {!decoded.signaturePresent ? (
              <p className="text-sm text-amber-800 dark:text-amber-200">
                세 번째 구간(서명)이 없습니다. 로컬 테스트용·불완전한 토큰일 수 있습니다.
              </p>
            ) : null}
            <div className="grid gap-6 lg:grid-cols-2">
              <JwtBlock title="Header" value={decoded.headerJson} onCopy={() => copy(decoded.headerJson)} />
              <JwtBlock title="Payload" value={decoded.payloadJson} onCopy={() => copy(decoded.payloadJson)} />
            </div>
            <button
              type="button"
              onClick={() => copy(combinedCopy)}
              className="w-full min-h-[44px] rounded-xl border border-[var(--border-strong)] bg-[var(--card-inner)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)]/40"
            >
              헤더·페이로드 한 번에 복사
            </button>
          </div>
        ) : decoded.message && raw.trim() ? (
          <div
            className="rounded-xl border border-red-500/40 bg-[var(--card)] p-5 text-sm text-red-700 dark:text-red-300"
            role="alert"
          >
            <p className="font-medium">디코딩할 수 없습니다</p>
            <p className="mt-2 leading-relaxed">{decoded.message}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            JWT를 붙여 넣으세요.
          </div>
        )
      }
    />
  );
}

function JwtBlock({
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
      <pre className="mt-3 max-h-[320px] overflow-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-xs text-[var(--foreground)] sm:text-sm">
        {value}
      </pre>
    </div>
  );
}
