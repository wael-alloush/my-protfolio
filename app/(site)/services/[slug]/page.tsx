import { ServiceDetail } from "@/components/services/ServiceDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { getService, getServices } from "@/lib/content";
import { breadcrumbJsonLd, createMetadata, serviceJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getServices()).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return createMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const related = (await getServices()).filter((item) => item.slug !== service.slug);

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
      <ServiceDetail service={service} related={related} />
    </>
  );
}
