import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { PortfolioShowcase } from "@/components/sections/PortfolioShowcase";
import { Process } from "@/components/sections/Process";
import { getFeaturedProjects } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export const metadata = createMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const projects = await getFeaturedProjects(10);

  return (
    <>
      <Hero />
      <Marquee />
      <Features />
      <PortfolioShowcase projects={projects} />
      <About />
      <Process />
      <FinalCta />
    </>
  );
}
