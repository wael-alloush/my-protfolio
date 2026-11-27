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
        "surface-border rounded-brand-lg p-6",
        interactive &&
          "transition duration-brand hover:border-brand-secondary/80",
        className,
      )}
    >
      {children}
    </div>
  );
}
