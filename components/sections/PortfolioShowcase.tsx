import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { HeadingLines } from "@/components/ui/RichText";
import { home } from "@/content/ar";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";
import Image from "next/image";

/** صف صور يتحرك أفقياً بلا توقف؛ المحتوى مكرر مرتين ليتصل بسلاسة */
function ThumbRow({
  projects,
  reverse = false,
}: {
  projects: Project[];
  reverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-max motion-reduce:animate-none",
        reverse ? "animate-marquee-slow-reverse" : "animate-marquee-slow",
      )}
    >
      {[0, 1].map((copy) => (
        <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
          {projects.map((project, index) => (
            <li
              key={`${copy}-${index}-${project.slug}`}
              className="relative me-[5px] h-[7.5rem] w-[10rem] shrink-0 overflow-hidden bg-brand-sand sm:h-[193px] sm:w-[255px]"
            >
              <Image
                src={project.image}
                alt={
                  copy === 0 ? `${home.portfolio.thumbAlt} ${project.name}` : ""
                }
                fill
                sizes="(max-width: 640px) 160px, 255px"
                className="object-cover object-top"
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function fillRow(list: Project[], count: number) {
  if (list.length === 0) return [];
  return Array.from({ length: count }, (_, index) => list[index % list.length]);
}

export function PortfolioShowcase({ projects }: { projects: Project[] }) {
  const rowCount = Math.max(6, projects.length);
  const { portfolio } = home;

  return (
    <section className="pt-20 lg:pt-[140px]">
      <Container>
        <Reveal>
          <div className="surface-border relative flex flex-col overflow-hidden rounded-brand-lg lg:h-[395px] lg:flex-row">
            <div className="relative z-10 flex shrink-0 flex-col items-start px-7 py-10 text-start lg:w-[36%] lg:pb-0 lg:pe-0 lg:ps-[25px] lg:pt-[101px]">
              <p className="flex h-[31px] items-center rounded-[7px] bg-brand-accent px-[17px] text-sm font-medium text-brand-dark">
                {portfolio.badge}
              </p>
              <h2 className="mt-2 text-[1.75rem] leading-[1.4] sm:text-4xl sm:leading-[1.4] lg:mt-0 lg:text-[2.5625rem] lg:leading-[58.5px]">
                <HeadingLines lines={portfolio.titleLines} />
              </h2>
              <Button
                href="/portfolio"
                variant="secondary"
                size="lg"
                className="mt-5 lg:mt-[15px]"
              >
                {portfolio.cta}
                <span aria-hidden>←</span>
              </Button>
            </div>

            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div className="flex flex-col gap-2">
                <ThumbRow projects={fillRow(projects, rowCount)} />
                <ThumbRow
                  projects={fillRow([...projects].reverse(), rowCount)}
                  reverse
                />
              </div>
              <div className="pointer-events-none absolute inset-y-0 start-0 hidden w-36 bg-linear-to-l from-brand-background to-transparent lg:block" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
