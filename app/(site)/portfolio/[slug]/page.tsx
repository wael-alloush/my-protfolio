import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { common } from "@/content/ar";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProject, getProjects } from "@/lib/content";
import { breadcrumbJsonLd, createMetadata, projectJsonLd } from "@/lib/seo";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return createMetadata({
    title: project.seoTitle || project.name,
    description: project.seoDescription || project.summary,
    path: `/portfolio/${project.slug}`,
    image: project.image,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <JsonLd
        data={[
          projectJsonLd(project),
          breadcrumbJsonLd([
            { name: "الرئيسية", path: "/" },
            { name: "أعمالي", path: "/portfolio" },
            { name: project.name, path: `/portfolio/${project.slug}` },
          ]),
        ]}
      />
      <Section className="mesh-dark text-brand-cream">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-brand-accent">
              {project.category}
            </p>
            <h1 className="mt-2 text-display">{project.name}</h1>
            <p className="mt-4 text-lg text-brand-muted">{project.summary}</p>
            {project.points.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-pill border border-brand-border bg-brand-card px-3 py-1 text-sm text-brand-cream"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {project.url ? (
                <Button href={project.url} variant="primary">
                  زيارة الموقع
                </Button>
              ) : null}
              <Button href="/portfolio" variant="secondary">
                العودة للأعمال
              </Button>
            </div>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-brand-lg border border-brand-cream/10 shadow-medium">
            <Image
              src={project.image}
              alt={`معاينة مشروع ${project.name}`}
              fill
              loading="eager"
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>
      {project.sections.length > 0 ? (
        <Section className="bg-brand-surface">
          <div className="mx-auto max-w-3xl space-y-5">
            {project.sections.map((section) => (
              <Card key={section.title}>
                <h2 className="text-xl font-extrabold text-brand-cream">
                  {section.title}
                </h2>
                {section.body ? (
                  <p className="mt-3 leading-8 text-brand-muted">{section.body}</p>
                ) : null}
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-brand-muted">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-2 leading-7">
                        <span className="text-brand-secondary" aria-hidden>
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            ))}
          </div>
        </Section>
      ) : null}
      <FinalCta
        title={`هل تريد مشروعاً مشابهاً لـ ${project.name}؟`}
        button={common.requestCta}
      />
    </>
  );
}
