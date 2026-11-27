import { About } from "@/components/sections/About";
import { FinalCta } from "@/components/sections/FinalCta";
import { Process } from "@/components/sections/Process";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { serviceIconForHref } from "@/components/services/ServiceIcons";
import { common, home, servicesPage } from "@/content/ar";
import { getServices } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "تصميم موقع إلكتروني وصفحة هبوط وتحسين الظهور",
  description: servicesPage.hero.subtitle,
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="relative overflow-hidden pb-4 pt-16 text-center lg:pt-24">
        <div className="glow-orb pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 w-[min(100%,36rem)] opacity-70" />
        <Container className="relative">
          <Reveal>
            <h1 className="text-display mx-auto max-w-4xl text-balance text-brand-cream">
              {servicesPage.hero.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-muted">
              {servicesPage.hero.subtitle}
            </p>
          </Reveal>
        </Container>
      </section>

      <Section>
        <ul className="mx-auto grid max-w-3xl grid-cols-2 gap-10 text-center">
          {servicesPage.stats.map((stat, i) => (
            <li key={stat.label}>
              <Reveal delay={i * 0.05}>
                <p className="text-5xl font-extrabold text-brand-cream sm:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm text-brand-muted">{stat.label}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-title text-balance text-brand-cream">
              {servicesPage.title}
            </h2>
            <p className="mt-4 text-brand-muted">{servicesPage.subtitle}</p>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {servicesPage.items.map((item, i) => {
            const slug = item.href.replace(/^\/services\//, "");
            const live = services.find((service) => service.slug === slug);
            const href = live ? `/services/${live.slug}` : item.href;
            return (
              <li key={item.href}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <article className="surface-border flex h-full flex-col items-center rounded-brand-xl px-8 py-10 text-center">
                    {serviceIconForHref(item.href, "h-14 w-14")}
                    <h3 className="mt-6 text-xl font-extrabold text-brand-cream">
                      {item.title}
                    </h3>
                    <p className="mt-3 leading-7 text-brand-muted">
                      {item.description}
                    </p>
                    <Link
                      href={href}
                      className="mt-6 inline-flex items-center gap-1 font-medium text-brand-accent transition duration-brand hover:gap-2"
                    >
                      {common.learnMore}
                      <span aria-hidden>←</span>
                    </Link>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal>
          <div className="mt-12 flex justify-center">
            <Button href="/portfolio" variant="primary">
              {home.portfolio.cta}
            </Button>
          </div>
        </Reveal>
      </Section>

      <About />
      <Process />
      <FinalCta />
    </>
  );
}
