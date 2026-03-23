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
};

export function PageContainer({
  children,
  className = "",
  variant = "default",
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full min-w-0 max-w-3xl px-4 sm:px-6 ${variantClass[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
