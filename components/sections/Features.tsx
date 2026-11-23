import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { HeadingLines } from "@/components/ui/RichText";
import { home } from "@/content/ar";
import { cn } from "@/lib/cn";
import Link from "next/link";

const iconClass = "h-16 w-16 shrink-0 fill-brand-accent lg:h-[82px] lg:w-[82px]";

const icons = [
  // نظام مخصص: قاعدة بيانات
  <svg key="system" viewBox="0 0 64 72" className={iconClass} aria-hidden>
    <ellipse cx="32" cy="14" rx="27" ry="12" />
    <path d="M5 25v10c0 6.6 12.1 12 27 12s27-5.4 27-12V25c-5.2 4.6-15.3 7.5-27 7.5S10.2 29.6 5 25Z" />
    <path d="M5 46v10c0 6.6 12.1 12 27 12s27-5.4 27-12V46c-5.2 4.6-15.3 7.5-27 7.5S10.2 50.6 5 46Z" />
  </svg>,
  // صفحة هبوط: مخطط أقسام الصفحة
  <svg key="wireframe" viewBox="0 0 64 64" className={iconClass} aria-hidden>
    <rect x="2" y="3" width="60" height="16" rx="4" />
    <rect x="2" y="25" width="26" height="36" rx="4" />
    <rect x="34" y="25" width="28" height="15" rx="4" />
    <rect x="34" y="46" width="28" height="15" rx="4" />
  </svg>,
  // تصميم متناسق: أشكال هندسية
  <svg key="shapes" viewBox="0 0 64 64" className={iconClass} aria-hidden>
    <path d="M14.3 5.8a3 3 0 0 1 5.3 0l11 19.6a3 3 0 0 1-2.6 4.5H6a3 3 0 0 1-2.6-4.5l10.9-19.6Z" />
    <rect x="36" y="4" width="25" height="25" rx="5" />
    <circle cx="17" cy="48" r="13" />
    <rect x="38.5" y="37.5" width="21" height="21" rx="4" transform="rotate(45 49 48)" />
  </svg>,
];

export function Features() {
  const { features } = home;

  return (
    <section className="relative pt-20 lg:pt-[120px]">
      <div className="glow-orb pointer-events-none absolute inset-x-0 top-6 mx-auto h-[22rem] w-[min(100%,46rem)] lg:top-8" />

      <Container className="relative">
        <Reveal>
          <div className="text-center">
            <h2 className="text-[1.75rem] leading-[1.5] sm:text-4xl sm:leading-[1.5] lg:text-[2.875rem] lg:leading-[70px]">
              <HeadingLines lines={features.titleLines} />
            </h2>
            <p className="mt-4 font-light text-brand-muted sm:text-lg sm:leading-[30px]">
              {features.subtitle}
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-6 lg:mt-6 lg:grid-cols-3 lg:items-center lg:gap-[30px]">
          {features.items.map((item, i) => (
            <li key={item.title} className="h-full lg:h-auto">
              <Reveal delay={i * 0.1} className="h-full">
                <article
                  className={cn(
                    "surface-border flex h-full flex-col items-start rounded-brand-xl px-8 pb-10 pt-12 text-start transition duration-brand hover:-translate-y-1 lg:pe-[60px] lg:ps-[45px] lg:pt-[100px]",
                    item.featured ? "lg:min-h-[468px]" : "lg:min-h-[420px]",
                  )}
                >
                  {icons[i]}
                  <h3 className="mt-8 text-[1.375rem] leading-[30px] text-brand-cream lg:mt-[37px] lg:text-[1.4375rem]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[0.9375rem] font-light leading-6 text-brand-muted">
                    {item.description}
                  </p>
                  {"linkLabel" in item && item.linkLabel ? (
                    <Link
                      href={item.href}
                      className="mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-light leading-6 text-brand-cream transition duration-brand hover:gap-2.5 hover:text-brand-accent"
                    >
                      {item.linkLabel}
                      <span aria-hidden>←</span>
                    </Link>
                  ) : null}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
