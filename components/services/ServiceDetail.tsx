import { FinalCta } from "@/components/sections/FinalCta";
import { ServiceIcon } from "@/components/services/ServiceIcons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { common } from "@/content/ar";
import type { Service } from "@/lib/content";
import { getSiteConfig } from "@/lib/settings";
import Link from "next/link";

export async function ServiceDetail({
  service,
  related,
}: {
  service: Service;
  related: Service[];
}) {
  const site = await getSiteConfig();

  return (
    <>
      <section className="relative overflow-hidden mesh-dark">
        <div className="pointer-events-none absolute -start-16 top-8 h-72 w-72 glow-orb opacity-70 blur-2xl" />
        <div className="pointer-events-none absolute -end-20 bottom-0 h-56 w-56 rounded-full bg-brand-secondary/10 blur-3xl" />
        <Container className="relative py-14 lg:py-20">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <Reveal>
              <p className="text-sm font-medium text-brand-muted">
                <Link
                  href="/services"
                  className="transition duration-brand hover:text-brand-cream"
                >
                  الخدمات
                </Link>
                <span className="mx-2 text-brand-border" aria-hidden>
                  /
                </span>
                <span className="text-brand-cream/80">{service.title}</span>
              </p>
              <h1 className="mt-5 text-display max-w-3xl text-balance text-brand-cream">
                {service.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lead text-brand-muted">
                {service.description}
              </p>
              {service.points.length > 0 ? (
                <ul className="mt-8 space-y-3">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-[0.9875rem] leading-7 text-brand-cream/85"
                    >
                      <span
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-9 flex flex-wrap gap-3">
                {site.social.whatsapp ? (
                  <Button href={site.social.whatsapp} variant="primary" size="lg">
                    {common.requestCta}
                  </Button>
                ) : (
                  <Button href="/contact" variant="primary" size="lg">
                    {common.requestCta}
                  </Button>
                )}
                <Button href="/portfolio" variant="secondary" size="lg">
                  شاهد أعمالي
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="hidden lg:block">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-brand-2xl border border-brand-border/60 bg-brand-card/40">
                <div className="pointer-events-none absolute inset-6 rounded-full bg-brand-secondary/10 blur-2xl" />
                <ServiceIcon
                  slug={service.slug}
                  className="relative h-24 w-24"
                  holeClassName="fill-brand-card"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section className="bg-brand-surface">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-lg leading-9 text-brand-text-soft sm:text-[1.125rem] sm:leading-9">
              {service.intro}
            </p>
          </Reveal>

          <div className="mt-14 space-y-0 border-t border-brand-border/70">
            {service.sections.map((section, index) => (
              <Reveal
                key={`${index}-${section.title}`}
                delay={Math.min(index * 0.05, 0.2)}
              >
                <article className="grid gap-5 border-b border-brand-border/70 py-10 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-8">
                  <p
                    className="text-sm tabular-nums tracking-wide text-brand-secondary"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h2 className="text-h3 text-brand-cream sm:text-[1.375rem]">
                      {section.title}
                    </h2>
                    {section.body ? (
                      <p className="mt-4 leading-8 text-brand-muted">
                        {section.body}
                      </p>
                    ) : null}
                    {section.bullets && section.bullets.length > 0 ? (
                      <ul className="mt-5 space-y-3">
                        {section.bullets.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 leading-7 text-brand-text-soft"
                          >
                            <span
                              className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-brand-secondary"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section>
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-h3 text-brand-cream">خدمات أخرى</h2>
              <p className="mt-2 text-sm leading-7 text-brand-muted">
                اختر المسار الأنسب لمرحلتك الحالية.
              </p>
              <ul className="mt-8 divide-y divide-brand-border/70 border-y border-brand-border/70">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/services/${item.slug}`}
                      className="group flex items-center gap-5 py-5 transition duration-brand hover:bg-brand-card/30"
                    >
                      <ServiceIcon
                        slug={item.slug}
                        className="h-10 w-10 shrink-0"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-brand-cream transition duration-brand group-hover:text-brand-accent">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-brand-muted line-clamp-1">
                          {item.description}
                        </span>
                      </span>
                      <span
                        className="text-brand-muted transition duration-brand group-hover:text-brand-accent"
                        aria-hidden
                      >
                        ←
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Section>
      ) : null}

      <FinalCta title={`هل تريد البدء في ${service.title}؟`} />
    </>
  );
}
