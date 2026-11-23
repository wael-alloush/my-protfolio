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
      className={cn("aspect-[925/520] h-9 w-auto", className)}
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
      className={cn("inline-flex items-center gap-3 text-brand-cream", className)}
      aria-label={`${siteConfig.name} - الصفحة الرئيسية`}
    >
      <LogoMark eager={eager} className="h-8 w-[3.56rem] sm:h-10 sm:w-[4.45rem]" />
      <span className="flex min-w-0 flex-col items-start leading-none">
        <span className="text-lg font-medium sm:text-2xl">
          <span className="text-brand-accent">{nameLead}</span>
          {nameRest.length > 0 ? ` ${nameRest.join(" ")}` : null}
        </span>
        <span className="mt-1.5 text-[0.6875rem] text-brand-muted sm:text-xs">
          {siteConfig.brandTagline}
        </span>
      </span>
    </Link>
  );
}
