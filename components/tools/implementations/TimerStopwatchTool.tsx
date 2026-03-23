"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormField } from "@/components/tool-page/FormField";

type Tab = "timer" | "stopwatch" | "pomodoro";

function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${formatClock(totalSec)}.${String(cs).padStart(2, "0")}`;
}

const POMO_SEC = 25 * 60;

type TimerStopwatchToolProps = { tool: ResolvedTool };

export function TimerStopwatchTool({ tool }: TimerStopwatchToolProps) {
  const [tab, setTab] = useState<Tab>("timer");
  const [timerSecRaw, setTimerSecRaw] = useState("300");
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [swMs, setSwMs] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const swStartRef = useRef<number>(0);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 880;
      g.gain.value = 0.0001;
      o.start();
      g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      o.stop(ctx.currentTime + 0.25);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!running || (tab !== "timer" && tab !== "pomodoro")) {
      if (tick.current) clearInterval(tick.current);
      tick.current = null;
      return;
    }
    tick.current = setInterval(() => {
      setRemaining((r) => (r <= 0 ? 0 : r - 1));
    }, 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [running, tab]);

  useEffect(() => {
    if (!running) return;
    if (remaining === 0) {
      playBeep();
      setRunning(false);
    }
  }, [remaining, running, playBeep]);

  useEffect(() => {
    if (!swRunning) return;
    const id = window.setInterval(() => {
      setSwMs(performance.now() - swStartRef.current);
    }, 50);
    return () => window.clearInterval(id);
  }, [swRunning]);

  const startTimer = useCallback(() => {
    if (tab === "pomodoro") {
      setRemaining(POMO_SEC);
    } else {
      const n = Math.max(1, parseInt(timerSecRaw.replace(/\D/g, ""), 10) || 1);
      setRemaining(Math.min(24 * 3600, n));
    }
    setRunning(true);
  }, [tab, timerSecRaw]);

  const pauseTimer = useCallback(() => setRunning(false), []);
  const resetTimer = useCallback(() => {
    setRunning(false);
    if (tab === "pomodoro") setRemaining(POMO_SEC);
    else {
      const n = Math.max(1, parseInt(timerSecRaw.replace(/\D/g, ""), 10) || 300);
      setRemaining(n);
    }
  }, [tab, timerSecRaw]);

  const startSw = useCallback(() => {
    swStartRef.current = performance.now() - swMs;
    setSwRunning(true);
  }, [swMs]);

  const pauseSw = useCallback(() => {
    setSwRunning(false);
  }, []);

  const resetSw = useCallback(() => {
    setSwRunning(false);
    setSwMs(0);
    swStartRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (tab === "pomodoro") setRemaining(POMO_SEC);
  }, [tab]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["timer", "타이머"],
                ["stopwatch", "스톱워치"],
                ["pomodoro", "뽀모도로 25분"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setRunning(false);
                  setSwRunning(false);
                  setTab(id);
                }}
                className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium ${
                  tab === id
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "stopwatch" ? (
            <div className="space-y-4">
              <p className="text-center font-mono text-4xl tabular-nums text-[var(--foreground)] sm:text-5xl">
                {formatMs(swMs)}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {!swRunning ? (
                  <button
                    type="button"
                    onClick={startSw}
                    className="min-h-[48px] rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white"
                  >
                    시작
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={pauseSw}
                    className="min-h-[48px] rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-6 py-2.5 text-sm font-semibold"
                  >
                    일시정지
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetSw}
                  className="min-h-[48px] rounded-xl border border-transparent bg-[var(--card-inner)] px-6 py-2.5 text-sm font-medium text-[var(--muted)]"
                >
                  초기화
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tab === "timer" ? (
                <FormField
                  label="목표 시간 (초)"
                  value={timerSecRaw}
                  onChange={(e) => {
                    setTimerSecRaw(e.target.value);
                    if (!running) {
                      const n = Math.max(1, parseInt(e.target.value.replace(/\D/g, ""), 10) || 300);
                      setRemaining(Math.min(24 * 3600, n));
                    }
                  }}
                  inputMode="numeric"
                  helperText="최대 하루(86400초)까지"
                />
              ) : (
                <p className="text-sm text-[var(--muted)]">25분 집중 세션입니다. 시작을 누르면 카운트다운이 시작됩니다.</p>
              )}
              <p className="text-center font-mono text-4xl tabular-nums text-[var(--foreground)] sm:text-5xl">
                {formatClock(remaining)}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {!running ? (
                  <button
                    type="button"
                    onClick={startTimer}
                    className="min-h-[48px] rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white"
                  >
                    시작
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={pauseTimer}
                    className="min-h-[48px] rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-6 py-2.5 text-sm font-semibold"
                  >
                    일시정지
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetTimer}
                  className="min-h-[48px] rounded-xl border border-transparent bg-[var(--card-inner)] px-6 py-2.5 text-sm font-medium text-[var(--muted)]"
                >
                  초기화
                </button>
              </div>
            </div>
          )}
        </div>
      }
      resultSlot={
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-inner)] p-4 text-sm text-[var(--muted)]">
          탭을 바꾸면 실행 중인 타이머·스톱워치는 멈춥니다. 끝나면 짧은 비프음을 재생합니다(브라우저가 허용할 때).
        </div>
      }
    />
  );
}
