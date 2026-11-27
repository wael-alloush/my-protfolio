import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

const paths = {
  "corporate-websites": (hole: string) => (
    <>
      <rect x="6" y="10" width="52" height="36" rx="4" />
      <path d="M6 14a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v4H6v-4Z" />
      <circle cx="12" cy="14" r="1.6" className={hole} />
      <circle cx="17.5" cy="14" r="1.6" className={hole} />
      <circle cx="23" cy="14" r="1.6" className={hole} />
      <rect x="12" y="24" width="18" height="16" rx="2" className={hole} />
      <rect x="34" y="24" width="18" height="4" rx="1.5" className={hole} />
      <rect x="34" y="31" width="14" height="3" rx="1.5" className={hole} />
      <rect x="34" y="37" width="16" height="3" rx="1.5" className={hole} />
      <rect x="24" y="48" width="16" height="3" rx="1.5" />
      <rect x="18" y="52" width="28" height="3" rx="1.5" />
    </>
  ),
  "landing-pages": (hole: string) => (
    <>
      <rect x="16" y="4" width="32" height="56" rx="6" />
      <rect x="22" y="12" width="20" height="5" rx="2" className={hole} />
      <rect x="24" y="21" width="16" height="3" rx="1.5" className={hole} />
      <rect x="26" y="27" width="12" height="3" rx="1.5" className={hole} />
      <rect x="22" y="36" width="20" height="10" rx="5" className={hole} />
      <rect x="28" y="52" width="8" height="2.5" rx="1.25" className={hole} />
    </>
  ),
  "search-visibility": () => (
    <>
      <path d="M28 10a16 16 0 1 0 9.8 28.6l9.3 9.3a2.5 2.5 0 0 0 3.5-3.5l-9.3-9.3A16 16 0 0 0 28 10Zm0 5a11 11 0 1 1 0 22 11 11 0 0 1 0-22Z" />
      <rect x="12" y="46" width="7" height="10" rx="2" />
      <rect x="23" y="40" width="7" height="16" rx="2" />
      <rect x="34" y="34" width="7" height="22" rx="2" />
      <rect x="45" y="28" width="7" height="28" rx="2" />
    </>
  ),
} as const;

export type ServiceIconSlug = keyof typeof paths;

export function isServiceIconSlug(slug: string): slug is ServiceIconSlug {
  return slug in paths;
}

export function ServiceIcon({
  slug,
  className,
  holeClassName = "fill-brand-background",
}: {
  slug: string;
  className?: string;
  holeClassName?: string;
}) {
  if (!isServiceIconSlug(slug)) return null;
  const draw = paths[slug];
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("fill-brand-secondary", className)}
      aria-hidden
    >
      {draw(holeClassName)}
    </svg>
  );
}

export function serviceIconForHref(
  href: string,
  className?: string,
): ReactNode {
  const slug = href.replace(/^\/services\//, "");
  return <ServiceIcon slug={slug} className={className} />;
}
