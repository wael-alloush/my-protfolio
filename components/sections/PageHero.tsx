import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { ReactNode } from "react";

export function PageHero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden mesh-dark">
      <div className="pointer-events-none absolute -inset-s-12 top-0 h-56 w-56 glow-orb opacity-80 blur-2xl" />
      <Container className="relative py-14 lg:py-20">
        <Reveal>
          <h1 className="text-display max-w-4xl text-balance text-brand-cream">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-5 max-w-2xl text-lead text-brand-muted">{subtitle}</p>
          ) : null}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
