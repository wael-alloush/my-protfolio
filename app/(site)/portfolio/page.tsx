import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { portfolioPage } from "@/content/ar";
import { getProjects } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "نماذج من مواقع صمّمتها",
  description: portfolioPage.subtitle,
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero title={portfolioPage.title} subtitle={portfolioPage.subtitle} />
      <PortfolioGrid projects={projects} />
      <FinalCta />
    </>
  );
}
