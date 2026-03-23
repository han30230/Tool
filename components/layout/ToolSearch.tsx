"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { tools } from "@/content/tools/registry";
import { filterToolsByQuery } from "@/lib/tools/search";

type ToolSearchProps = {
  className?: string;
  /** 모바일 등에서 접기 */
  compact?: boolean;
};

export function ToolSearch({ className = "", compact = false }: ToolSearchProps) {
  const [q, setQ] = useState("");
  const hits = useMemo(() => filterToolsByQuery(tools, q).slice(0, 8), [q]);
  const open = q.trim().length > 0;

  return (
    <div className={`relative ${className}`}>
      <label htmlFor="global-tool-search" className="sr-only">
        도구 검색
      </label>
      <input
        id="global-tool-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={compact ? "검색…" : "도구 이름·기능 검색…"}
        autoComplete="off"
        className="w-full min-h-[44px] rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] shadow-[var(--shadow-sm)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]/40 focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
      />
      {open ? (
        <ul
          className="absolute left-0 right-0 z-50 mt-2 max-h-[min(70vh,320px)] overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] py-2 shadow-[var(--shadow-lg)]"
        >
          {hits.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[var(--muted)]">일치하는 도구가 없습니다.</li>
          ) : (
            hits.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="block px-4 py-2.5 text-left text-sm text-[var(--foreground)] transition hover:bg-[var(--accent-subtle)] focus-visible:bg-[var(--accent-subtle)] focus-visible:outline-none"
                  onClick={() => setQ("")}
                >
                  <span className="font-medium text-[var(--accent)]">{t.shortTitle}</span>
                  <span className="text-[var(--muted)]"> · </span>
                  {t.title}
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
