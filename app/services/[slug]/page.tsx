import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServiceBySlug, services } from "@/content/services";
import { breadcrumbJsonLd, createMetadata, serviceJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return createMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(service),
          breadcrumbJsonLd([
            { name: "الرئيسية", path: "/" },
            { name: "الخدمات", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />
      <PageHero title={service.title} subtitle={service.description}>
        <ul className="mt-6 flex flex-wrap gap-2">
          {service.points.map((point) => (
            <li
              key={point}
              className="rounded-pill border border-brand-border bg-brand-card px-3 py-1 text-sm text-brand-cream"
            >
              {point}
            </li>
          ))}
        </ul>
      </PageHero>

      <Section className="bg-brand-surface">
        <Reveal>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-brand-muted">
            {service.intro}
          </p>
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl space-y-5">
          {service.sections.map((section, i) => (
            <Reveal key={section.title} delay={Math.min(i * 0.04, 0.2)}>
              <Card>
                <h2 className="text-xl font-extrabold text-brand-cream">
                  {section.title}
                </h2>
                {section.body ? (
                  <p className="mt-3 leading-8 text-brand-muted">{section.body}</p>
                ) : null}
                {section.bullets ? (
                  <ul className="mt-4 space-y-2 text-brand-muted">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-2 leading-7">
                        <span className="text-brand-accent" aria-hidden>
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta title={`هل تريد البدء في ${service.title}؟`} />
    </>
  );
}
