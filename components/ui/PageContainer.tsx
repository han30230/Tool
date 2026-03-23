import type { ReactNode } from "react";

type Variant = "default" | "header" | "footer";

const variantClass: Record<Variant, string> = {
  default: "py-10 sm:py-14",
  header: "py-3.5 sm:py-4",
  footer: "py-12 sm:py-14",
};

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  /** 홈·랜딩 등 시야를 넓게 쓸 때 */
  wide?: boolean;
};

export function PageContainer({
  children,
  className = "",
  variant = "default",
  wide = false,
}: PageContainerProps) {
  const max = wide ? "max-w-5xl" : "max-w-3xl";
  return (
    <div
      className={`mx-auto w-full min-w-0 ${max} px-4 sm:px-6 lg:px-8 ${variantClass[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
