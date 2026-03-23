"use client";

import { useCallback, useEffect, useId, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";

const STORAGE_KEY = "tool-site-todos-v1";

type Item = { id: string; text: string; done: boolean };

function load(): Item[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is Item => typeof x === "object" && x !== null && "id" in x && "text" in x && "done" in x)
      .map((x) => ({
        id: String(x.id),
        text: String(x.text),
        done: Boolean(x.done),
      }));
  } catch {
    return [];
  }
}

function save(items: Item[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota */
  }
}

type TodoChecklistToolProps = { tool: ResolvedTool };

export function TodoChecklistTool({ tool }: TodoChecklistToolProps) {
  const uid = useId();
  const [items, setItems] = useState<Item[]>([]);
  const [draft, setDraft] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(load());
    setMounted(true);
  }, []);

  const persist = useCallback((next: Item[]) => {
    setItems(next);
    save(next);
  }, []);

  const add = useCallback(() => {
    const t = draft.trim();
    if (!t) return;
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    persist([...items, { id, text: t, done: false }]);
    setDraft("");
  }, [draft, items, persist]);

  const toggle = useCallback(
    (id: string) => {
      persist(items.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
    },
    [items, persist],
  );

  const remove = useCallback(
    (id: string) => {
      persist(items.filter((x) => x.id !== id));
    },
    [items, persist],
  );

  const clearDone = useCallback(() => {
    persist(items.filter((x) => !x.done));
  }, [items, persist]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)]">
            목록은 이 브라우저의 localStorage에만 저장됩니다. 시크릿 창·다른 기기와는 공유되지 않습니다.
          </p>
          {!mounted ? (
            <p className="text-sm text-[var(--muted)]">불러오는 중…</p>
          ) : (
            <>
              <form
                className="flex flex-wrap gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  add();
                }}
              >
                <div className="min-w-0 flex-1">
                  <FormField
                    label="새 항목"
                    id={`${uid}-draft`}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="할 일을 입력하고 Enter 또는 추가"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-8 min-h-[48px] shrink-0 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-md)]"
                >
                  추가
                </button>
              </form>
              <ul className="space-y-2" aria-label="할 일 목록">
                {items.length === 0 ? (
                  <li className="rounded-xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
                    항목이 없습니다.
                  </li>
                ) : (
                  items.map((x) => (
                    <li
                      key={x.id}
                      className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 shadow-[var(--shadow-sm)]"
                    >
                      <input
                        type="checkbox"
                        checked={x.done}
                        onChange={() => toggle(x.id)}
                        className="mt-1 h-4 w-4 rounded border-[var(--border)]"
                        aria-label={`완료: ${x.text}`}
                      />
                      <span
                        className={`min-w-0 flex-1 text-sm leading-relaxed ${
                          x.done ? "text-[var(--muted)] line-through" : "text-[var(--foreground)]"
                        }`}
                      >
                        {x.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(x.id)}
                        className="shrink-0 text-xs font-medium text-[var(--muted)] underline underline-offset-2 hover:text-red-600"
                      >
                        삭제
                      </button>
                    </li>
                  ))
                )}
              </ul>
              {items.some((x) => x.done) ? (
                <button
                  type="button"
                  onClick={clearDone}
                  className="text-sm font-medium text-[var(--muted)] underline underline-offset-2 hover:text-[var(--foreground)]"
                >
                  완료된 항목 모두 지우기
                </button>
              ) : null}
            </>
          )}
        </div>
      }
      resultSlot={
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-inner)] p-4 text-sm text-[var(--muted)]">
          총 {items.length}개 · 완료 {items.filter((x) => x.done).length}개
        </div>
      }
    />
  );
}
