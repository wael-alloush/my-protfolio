import { FinalCta } from "@/components/sections/FinalCta";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { portfolioPage } from "@/content/ar";
import { projects } from "@/content/projects";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "أعمالي",
  description: portfolioPage.subtitle,
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <PortfolioGrid projects={projects} />
      <FinalCta />
    </>
  );
}
