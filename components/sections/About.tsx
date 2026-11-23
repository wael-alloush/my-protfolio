import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { BodyText, HeadingLines } from "@/components/ui/RichText";
import { home } from "@/content/ar";
import { siteConfig } from "@/lib/site";
import Image from "next/image";

export function About() {
  const { about } = home;

  return (
    <section className="relative overflow-hidden pt-20 lg:pt-[145px]">
      <div className="glow-orb pointer-events-none absolute inset-x-0 top-0 mx-auto h-[28rem] w-[min(100%,46rem)]" />

      <Container className="relative text-center">
        <Reveal>
          <div className="relative mx-auto h-[153px] w-[153px] overflow-hidden rounded-full border-2 border-brand-accent bg-brand-primary">
            <Image
              src="/brand/wael.jpg"
              alt={`${about.photoAlt}: ${siteConfig.name}`}
              fill
              sizes="153px"
              className="object-cover object-[50%_22%]"
            />
          </div>

          <p className="mt-2 text-lg font-light leading-[30px] text-brand-muted">
            {about.greetingPrefix} {siteConfig.name} 👋
          </p>

          <h2 className="mt-5 text-[1.875rem] leading-[1.6] sm:text-4xl sm:leading-[1.6] lg:text-[2.875rem] lg:leading-[70px]">
            <HeadingLines lines={about.titleLines} />
          </h2>

          <p className="mx-auto mt-4 max-w-[650px] font-light leading-[27px] text-brand-muted sm:text-[1.0625rem] lg:mt-[11px]">
            <BodyText segments={about.body} />
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
