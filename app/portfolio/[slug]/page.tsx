import { Button } from "@/components/ui/Button";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { common } from "@/content/ar";
import { getProjectBySlug, projects } from "@/content/projects";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createMetadata, projectJsonLd } from "@/lib/seo";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return createMetadata({
    title: project.name,
    description: project.summary,
    path: `/portfolio/${project.slug}`,
    image: project.image,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
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
            {project.points ? (
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
          <div className="relative aspect-[4/3] overflow-hidden rounded-brand-lg border border-brand-cream/10 shadow-medium">
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
      <FinalCta
        title={`هل تريد مشروعاً مشابهاً لـ ${project.name}؟`}
        button={common.requestCta}
      />
    </>
  );
}
