"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/ui/NavLink";
import { nav } from "@/content/ar";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";
import { Fragment, useEffect, useState } from "react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-3 lg:pt-[17px]">
      <Container>
        <div className="flex h-14 min-w-0 items-center justify-between gap-2 overflow-hidden rounded-pill border border-brand-border bg-brand-background/75 ps-3 pe-1 backdrop-blur-xl sm:h-16 sm:gap-4 sm:ps-5 sm:pe-3 lg:h-[87px] lg:px-[21px]">
          <Logo eager className="shrink" />

          <nav className="hidden items-center lg:flex" aria-label="القائمة الرئيسية">
            {nav.links.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 ? (
                  <span
                    className="mx-4 h-3 w-px bg-brand-cream/30"
                    aria-hidden
                  />
                ) : null}
                <NavLink
                  href={link.href}
                  className="px-2 py-1.5 text-sm font-light transition duration-brand hover:text-brand-accent"
                  idleClassName="text-brand-cream/85"
                  activeClassName="text-brand-accent"
                >
                  {link.label}
                </NavLink>
              </Fragment>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button
              href={siteConfig.social.whatsapp}
              variant="primary"
              size="sm"
              className="!h-8 !px-2.5 !text-xs sm:!h-9 sm:!px-3.5 sm:!text-sm"
              onClick={() => setMobileOpen(false)}
            >
              {nav.contact}
            </Button>
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill text-brand-cream transition duration-brand hover:text-brand-accent sm:h-11 sm:w-11 lg:hidden"
              aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                {mobileOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          "fixed inset-0 -z-10 bg-brand-background/80 transition duration-brand lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      <aside
        id="mobile-drawer"
        className={cn(
          "fixed inset-y-0 start-0 -z-10 flex w-[min(100%,20rem)] flex-col border-e border-brand-border bg-brand-surface px-6 pb-8 pt-28 text-brand-cream shadow-medium transition duration-brand lg:hidden",
          mobileOpen
            ? "visible translate-x-0"
            : "invisible translate-x-full",
        )}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col gap-1" aria-label="قائمة الجوال">
          {nav.links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="rounded-pill px-4 py-3 font-medium transition duration-brand hover:bg-brand-cream/5 hover:text-brand-accent"
              activeClassName="text-brand-accent"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Button
          href={siteConfig.social.whatsapp}
          variant="primary"
          className="mt-6"
          onClick={() => setMobileOpen(false)}
        >
          {nav.cta}
        </Button>
      </aside>
    </header>
  );
}
