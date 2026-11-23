"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** رابط تنقّل يميّز الصفحة الحالية */
export function NavLink({
  href,
  children,
  className,
  idleClassName,
  activeClassName,
  onClick,
}: {
  href: string;
  children: ReactNode;
  /** أصناف مشتركة للحالتين */
  className?: string;
  /** أصناف الرابط عندما لا يكون هو الصفحة الحالية */
  idleClassName?: string;
  /** أصناف الرابط عندما يكون هو الصفحة الحالية */
  activeClassName?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(className, active ? activeClassName : idleClassName)}
    >
      {children}
    </Link>
  );
}
