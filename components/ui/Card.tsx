import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

/** 정적 카드 */
export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-md)] sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
