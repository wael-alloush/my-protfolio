import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

/** رمز WA بخلفية شفافة (PNG مستخرج من ملف الشعار المرفق) */
export function LogoMark({
  className,
  eager = false,
}: {
  className?: string;
  eager?: boolean;
}) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt=""
      width={925}
      height={520}
      sizes="160px"
      loading={eager ? "eager" : "lazy"}
      className={cn("aspect-925/520 h-9 w-auto", className)}
    />
  );
}

export function Logo({
  className,
  eager = false,
}: {
  className?: string;
  eager?: boolean;
}) {
  const [nameLead, ...nameRest] = siteConfig.name.split(" ");

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex min-w-0 items-center gap-2 text-brand-cream sm:gap-3",
        className,
      )}
      aria-label={`${siteConfig.name} - الصفحة الرئيسية`}
    >
      <LogoMark
        eager={eager}
        className="h-7 w-12.48 shrink-0 sm:h-10 sm:w-17.8"
      />
      <span className="flex min-w-0 flex-col items-start leading-none">
        <span className="max-w-full truncate text-sm font-medium min-[380px]:text-base sm:text-lg lg:text-2xl">
          <span className="text-brand-accent">{nameLead}</span>
          {nameRest.length > 0 ? ` ${nameRest.join(" ")}` : null}
        </span>
        <span className="mt-1 hidden max-w-full truncate text-[0.6875rem] text-brand-muted sm:block sm:text-xs">
          {siteConfig.brandTagline}
        </span>
      </span>
    </Link>
  );
}
