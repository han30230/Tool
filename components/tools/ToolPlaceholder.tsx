import type { ResolvedTool } from "@/content/tools/types";

type ToolPlaceholderProps = {
  tool: ResolvedTool;
};

/** 입력·결과 슬롯 데모. 실제 툴 구현 시 각각 교체 */
export function ToolPlaceholderInput({ tool }: ToolPlaceholderProps) {
  return (
    <div
      className="min-h-[120px] rounded-2xl border border-dashed border-[var(--accent)]/20 bg-[var(--card-inner)]/50 p-4"
      role="region"
      aria-label={`${tool.title} 입력`}
    >
      <p className="text-sm font-medium text-[var(--foreground)]">입력 영역</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        <code className="rounded bg-[var(--border)]/50 px-1 font-mono text-xs">FormField</code> 등으로
        폼을 구성합니다.
      </p>
    </div>
  );
}

export function ToolPlaceholderResult({ tool }: ToolPlaceholderProps) {
  return (
    <div
      className="min-h-[120px] rounded-2xl border border-dashed border-[var(--accent)]/20 bg-[var(--card-inner)]/50 p-4"
      role="region"
      aria-label={`${tool.title} 결과`}
    >
      <p className="text-sm font-medium text-[var(--foreground)]">결과 영역</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        <code className="rounded bg-[var(--border)]/50 px-1 font-mono text-xs">ResultCard</code>로
        값을 표시합니다.
      </p>
    </div>
  );
}
