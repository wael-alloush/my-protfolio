import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/** حاوية المحتوى: عرض داخلي 1200px على الشاشات الكبيرة */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-site px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}
