"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CategoryId } from "@/content/tools/types";
import { categories, tools } from "@/content/tools/registry";
import {
  hubCategories,
  filterToolsByHub,
  type HubCategoryId,
} from "@/content/tools/hub-categories";
import { filterToolsByQuery } from "@/lib/tools/search";
import { sortTools, type ToolSortMode } from "@/lib/tools/sort";

const categoryIds = Object.keys(categories) as CategoryId[];

function parseSort(s: string | null): ToolSortMode {
  if (s === "alpha" || s === "new") return s;
  return "popular";
}

export function BrowseClient() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const q = sp.get("q") ?? "";
  const cat = sp.get("cat") as CategoryId | null;
  const hub = sp.get("hub") as HubCategoryId | null;
  const sort = parseSort(sp.get("sort"));

  const setParams = useCallback(
    (next: { q?: string; cat?: string | null; hub?: string | null; sort?: ToolSortMode }) => {
      const p = new URLSearchParams(sp.toString());
      const qv = next.q !== undefined ? next.q : q;
      const catv = next.cat !== undefined ? next.cat : cat;
      const hubv = next.hub !== undefined ? next.hub : hub;
      const sortv = next.sort !== undefined ? next.sort : sort;
      if (qv.trim()) p.set("q", qv.trim());
      else p.delete("q");
      if (catv && categoryIds.includes(catv as CategoryId)) p.set("cat", catv);
      else p.delete("cat");
      if (hubv && hubCategories.some((h) => h.id === hubv)) p.set("hub", hubv);
      else p.delete("hub");
      if (sortv && sortv !== "popular") p.set("sort", sortv);
      else p.delete("sort");
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, sp, q, cat, hub, sort],
  );

  const filtered = useMemo(() => {
    let list = tools;
    if (cat && categoryIds.includes(cat)) {
      list = list.filter((t) => t.categoryId === cat);
    }
    if (hub && hubCategories.some((h) => h.id === hub)) {
      const byHub = filterToolsByHub(tools, hub);
      const hubSet = new Set(byHub.map((t) => t.slug));
      list = list.filter((t) => hubSet.has(t.slug));
    }
    if (q.trim()) {
      list = filterToolsByQuery(list, q);
    }
    return sortTools(list, sort);
  }, [cat, hub, q, sort]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            검색
            <input
              type="search"
              value={q}
              placeholder="이름·태그·설명"
              autoComplete="off"
              onChange={(e) => setParams({ q: e.target.value })}
              className="mt-1.5 w-full min-h-[44px] rounded-xl border border-[var(--border-strong)] bg-[var(--card-inner)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]/40 focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            기존 카테고리
            <select
              value={cat ?? ""}
              onChange={(e) => setParams({ cat: e.target.value || null })}
              className="mt-1.5 w-full min-h-[44px] rounded-xl border border-[var(--border-strong)] bg-[var(--card-inner)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]/40"
            >
              <option value="">전체</option>
              {categoryIds.map((id) => (
                <option key={id} value={id}>
                  {categories[id].title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            주제 허브
            <select
              value={hub ?? ""}
              onChange={(e) => setParams({ hub: e.target.value || null })}
              className="mt-1.5 w-full min-h-[44px] rounded-xl border border-[var(--border-strong)] bg-[var(--card-inner)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]/40"
            >
              <option value="">전체</option>
              {hubCategories.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-[var(--muted)]">카테고리와 함께 고르면 교집합입니다.</span>
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            정렬
            <select
              value={sort}
              onChange={(e) => setParams({ sort: e.target.value as ToolSortMode })}
              className="mt-1.5 w-full min-h-[44px] rounded-xl border border-[var(--border-strong)] bg-[var(--card-inner)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]/40"
            >
              <option value="popular">인기순</option>
              <option value="new">최신 추가순</option>
              <option value="alpha">가나다순</option>
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          {filtered.length}개 도구가 조건에 맞습니다.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/tools/${t.slug}`}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)]/30 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                {categories[t.categoryId].title}
              </span>
              <p className="mt-1 text-base font-semibold text-[var(--foreground)]">{t.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{t.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
          조건을 바꿔 보거나{" "}
          <button
            type="button"
            className="font-medium text-[var(--accent)] underline underline-offset-2"
            onClick={() => setParams({ q: "", cat: null, hub: null, sort: "popular" })}
          >
            필터 초기화
          </button>
        </p>
      ) : null}
    </div>
  );
}
