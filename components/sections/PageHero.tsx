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
      <div className="pointer-events-none absolute -start-16 top-0 h-64 w-64 glow-orb blur-2xl" />
      <Container className="relative py-16 lg:py-24">
        <Reveal>
          <h1 className="text-display max-w-4xl text-balance text-brand-cream">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-5 max-w-2xl text-lg text-brand-muted">{subtitle}</p>
          ) : null}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
