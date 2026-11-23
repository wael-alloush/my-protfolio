import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "surface-border rounded-brand-lg p-6 shadow-soft",
        interactive &&
          "transition duration-brand hover:-translate-y-1 hover:shadow-medium",
        className,
      )}
    >
      {children}
    </div>
  );
}
