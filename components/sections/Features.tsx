import { serviceIconForHref } from "@/components/services/ServiceIcons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { HeadingLines } from "@/components/ui/RichText";
import { home } from "@/content/ar";
import { cn } from "@/lib/cn";
import Link from "next/link";

export function Features() {
  const { features } = home;

  return (
    <section className="relative pt-20 lg:pt-28">
      <Container className="relative">
        <Reveal>
          <div className="text-center">
            <h2 className="text-h2 text-brand-cream sm:text-[2.25rem] lg:text-[2.75rem]">
              <HeadingLines lines={features.titleLines} />
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lead text-brand-muted">
              {features.subtitle}
            </p>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {features.items.map((item, i) => (
            <li key={item.title} className="h-full">
              <Reveal delay={i * 0.1} className="h-full">
                <article
                  className={cn(
                    "surface-border flex h-full flex-col items-start rounded-brand-xl px-6 py-8 text-start transition duration-brand hover:border-brand-secondary/80 sm:px-8 sm:py-9",
                    item.featured && "lg:pt-10",
                  )}
                >
                  {serviceIconForHref(item.href, "h-14 w-14 shrink-0 lg:h-16 lg:w-16")}
                  <h3 className="mt-6 text-h3 text-brand-cream">{item.title}</h3>
                  <p className="mt-3 text-[0.9875rem] leading-7 text-brand-muted">
                    {item.description}
                  </p>
                  {"linkLabel" in item && item.linkLabel ? (
                    <Link
                      href={item.href}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-cream transition duration-brand hover:gap-2.5 hover:text-brand-accent"
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
