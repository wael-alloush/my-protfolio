"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "الرئيسية" },
  { href: "/admin/posts", label: "المقالات" },
  { href: "/admin/services", label: "الخدمات" },
  { href: "/admin/projects", label: "المشاريع" },
  { href: "/admin/channels", label: "التواصل والإعلانات" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="أقسام لوحة التحكم" className="hide-scrollbar overflow-x-auto">
      <ul className="flex w-max gap-1">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center rounded-pill px-4 text-sm font-medium transition duration-brand",
                  active
                    ? "bg-brand-card text-brand-accent"
                    : "text-brand-muted hover:text-brand-cream",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
