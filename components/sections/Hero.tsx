"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BodyText } from "@/components/ui/RichText";
import { home } from "@/content/ar";
import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const reduce = useReducedMotion();
  const { hero } = home;

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.5, ease: "easeOut" as const },
        };

  return (
    <section className="relative overflow-hidden pb-12 pt-10 lg:pb-[61px] lg:pt-[68px]">
      <Container className="relative text-center">
        <motion.h1 {...rise(0)}>
          <span className="mx-auto block w-fit text-[1.875rem] font-extralight leading-[1.3] text-brand-cream sm:text-5xl sm:leading-[1.3] lg:text-[3.75rem] lg:leading-[78px]">
            {hero.line1}
          </span>
          <span className="mx-auto mt-3 block w-fit text-[2.25rem] font-bold leading-[1.3] text-brand-cream sm:text-6xl sm:leading-[1.3] lg:mt-4 lg:text-[3.9375rem] lg:leading-[85px]">
            {hero.line2.before}{" "}
            <span className="text-brand-accent">{hero.line2.accent}</span>
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-8 max-w-[37.5rem] text-base font-light leading-[1.95] text-brand-cream/85 sm:text-[1.1875rem] sm:leading-[35.2px]"
          {...rise(0.12)}
        >
          <BodyText segments={hero.body} />
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-[21px] lg:mt-12"
          {...rise(0.2)}
        >
          <Button href={hero.primaryHref} variant="primary" size="lg">
            {hero.primaryCta}
            <span aria-hidden>←</span>
          </Button>
          <Button href={hero.secondaryHref} variant="secondary" size="lg">
            {hero.secondaryCta}
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
