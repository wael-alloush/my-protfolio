import { cn } from "@/lib/cn";
import type { Status } from "@/lib/content";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-h2 text-brand-cream sm:text-[1.75rem]">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-7 text-brand-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "surface-border rounded-brand-xl p-5 sm:p-6",
        className,
      )}
    >
      {title ? (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-brand-cream">{title}</h2>
          {description ? (
            <p className="mt-1.5 text-sm leading-7 text-brand-muted">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const published = status === "published";
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-pill px-2.5 text-xs font-medium",
        published
          ? "bg-brand-accent text-brand-dark"
          : "border border-brand-border text-brand-muted",
      )}
    >
      {published ? "منشور" : "مسودة"}
    </span>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "error";
  children: ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-brand-lg border px-4 py-3 text-sm leading-7",
        tone === "error" && "border-brand-error/80 text-brand-error",
        tone === "success" && "border-brand-secondary text-brand-text-soft",
        tone === "info" && "border-brand-border bg-brand-background/50 text-brand-muted",
      )}
    >
      {children}
    </div>
  );
}
