"use client";

import { portfolioPage } from "@/content/ar";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const categories = [portfolioPage.filterAll, ...portfolioPage.categories];

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>(portfolioPage.filterAll);
  const visible =
    active === portfolioPage.filterAll
      ? projects
      : projects.filter((project) => project.category === active);

  return (
    <section className="section-space">
      <div className="mx-auto w-full max-w-site px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const selected = category === active;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={cn(
                  "h-10 rounded-pill px-5 text-sm font-medium transition duration-brand",
                  selected
                    ? "fill-accent-gradient text-brand-dark shadow-glow"
                    : "border border-brand-border text-brand-cream hover:border-brand-accent hover:text-brand-accent",
                )}
                aria-pressed={selected}
              >
                {category}
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="py-16 text-center text-brand-muted">{portfolioPage.empty}</p>
        ) : null}

        <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((project) => (
            <li key={project.slug}>
              <Link href={`/portfolio/${project.slug}`} className="group block text-center">
                <div className="relative aspect-[4/3] overflow-hidden rounded-brand-lg border border-brand-cream/10 bg-brand-card">
                  <Image
                    src={project.image}
                    alt={`معاينة مشروع ${project.name}`}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    className="object-cover object-top transition duration-brand group-hover:scale-105"
                  />
                </div>
                <h2 className="mt-3 font-medium text-brand-cream">{project.name}</h2>
                <p className="mt-1 text-sm text-brand-muted">{project.category}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
