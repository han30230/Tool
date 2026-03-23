"use client";

import md5 from "md5";
import { useEffect, useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

function bufToHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

type HashGeneratorToolProps = { tool: ResolvedTool };

export function HashGeneratorTool({ tool }: HashGeneratorToolProps) {
  const [text, setText] = useState("hello");
  const [sha1, setSha1] = useState("");
  const [sha256, setSha256] = useState("");

  const md5Hex = useMemo(() => md5(text), [text]);

  useEffect(() => {
    let cancelled = false;
    const enc = new TextEncoder().encode(text);
    (async () => {
      try {
        const [d1, d256] = await Promise.all([
          crypto.subtle.digest("SHA-1", enc),
          crypto.subtle.digest("SHA-256", enc),
        ]);
        if (!cancelled) {
          setSha1(bufToHex(d1));
          setSha256(bufToHex(d256));
        }
      } catch {
        if (!cancelled) {
          setSha1("");
          setSha256("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [text]);

  const copyText = useMemo(
    () =>
      [
        `MD5:    ${md5Hex}`,
        `SHA-1:  ${sha1}`,
        `SHA-256: ${sha256}`,
      ].join("\n"),
    [md5Hex, sha1, sha256],
  );

  const hasAny = md5Hex && sha1 && sha256;

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            UTF-8 기준으로 해시합니다. 브라우저에서만 계산되며 서버로 보내지 않습니다.
          </p>
          <FormTextarea
            label="입력 텍스트"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
          <ToolActionBar onReset={() => setText("")} onExample={() => setText("hello")} />
        </div>
      }
      resultSlot={
        hasAny ? (
          <ResultCard
            primaryLabel="SHA-256"
            primaryValue={sha256}
            copyText={copyText}
            description="아래는 MD5·SHA-1입니다. 보안 저장용이 아닌 참고·검증용으로 쓰세요."
            extraRows={[
              { label: "MD5", value: md5Hex },
              { label: "SHA-1", value: sha1 },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            해시를 계산할 수 없습니다. 브라우저 환경을 확인해 주세요.
          </div>
        )
      }
    />
  );
}
