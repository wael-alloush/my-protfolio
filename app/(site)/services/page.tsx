import { About } from "@/components/sections/About";
import { FinalCta } from "@/components/sections/FinalCta";
import { Process } from "@/components/sections/Process";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { common, home, servicesPage } from "@/content/ar";
import { getServices } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "خدمات تصميم مواقع للشركات والعيادات",
  description: servicesPage.hero.subtitle,
  path: "/services",
});

const iconClass = "h-14 w-14 fill-brand-secondary";

const icons = [
  <svg key="site" viewBox="0 0 64 64" className={iconClass} aria-hidden>
    <rect x="8" y="6" width="48" height="52" rx="6" />
    <rect x="16" y="16" width="32" height="4" rx="2" className="fill-brand-background" />
    <rect x="16" y="26" width="22" height="4" rx="2" className="fill-brand-background" />
    <rect x="16" y="36" width="28" height="4" rx="2" className="fill-brand-background" />
  </svg>,
  <svg key="landing" viewBox="0 0 64 64" className={iconClass} aria-hidden>
    <rect x="14" y="4" width="36" height="56" rx="6" />
    <rect x="22" y="14" width="20" height="4" rx="2" className="fill-brand-background" />
    <rect x="22" y="24" width="14" height="4" rx="2" className="fill-brand-background" />
    <rect x="22" y="40" width="20" height="8" rx="4" className="fill-brand-background" />
  </svg>,
  <svg key="redesign" viewBox="0 0 64 64" className={iconClass} aria-hidden>
    <path d="M32 8a24 24 0 1 1-17 7.1l-5-5v14h14l-4.6-4.6A16 16 0 1 0 32 16V8Z" />
  </svg>,
];

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
          {services.map((service, i) => (
            <li key={service.slug}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <article className="surface-border flex h-full flex-col items-center rounded-brand-xl px-8 py-10 text-center">
                  {icons[i % icons.length]}
                  <h3 className="mt-6 text-xl font-extrabold text-brand-cream">
                    {service.cardTitle || service.title}
                  </h3>
                  <p className="mt-3 leading-7 text-brand-muted">
                    {service.cardDescription || service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-6 inline-flex items-center gap-1 font-medium text-brand-accent transition duration-brand hover:gap-2"
                  >
                    {common.learnMore}
                    <span aria-hidden>←</span>
                  </Link>
                </article>
              </Reveal>
            </li>
          ))}
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
