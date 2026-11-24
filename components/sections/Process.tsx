import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { home } from "@/content/ar";

export function Process() {
  const { process } = home;

  return (
    <section className="pt-20 lg:pt-21.25">
      <Container>
        <Reveal>
          <div className="relative flex items-center justify-center">
            <span
              className="line-fade absolute inset-x-0 top-1/2 h-px lg:inset-x-[5%]"
              aria-hidden
            />
            <h2 className="relative flex h-7.75 items-center rounded-[7px] bg-brand-accent px-4.25 text-sm font-medium text-brand-dark">
              {process.title}
            </h2>
          </div>
        </Reveal>

        <ol className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 min-[30rem]:grid-cols-2 lg:mt-11 lg:flex lg:justify-between lg:px-6.25">
          {process.steps.map((step, i) => (
            <li key={step.lead}>
              <Reveal delay={i * 0.08} className="text-start">
                <span
                  className="block w-fit overflow-visible bg-linear-to-b from-brand-primary to-brand-primary/5 bg-clip-text pt-[0.12em] text-[5.75rem] font-bold leading-[0.9] text-transparent select-none sm:text-[7rem] lg:text-[8.125rem]"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <h3 className="relative mt-1.75 text-2xl font-bold leading-8.5 text-brand-cream lg:text-[1.5625rem]">
                  {step.lead}{" "}
                  <span className="text-brand-accent">{step.accent}</span>
                </h3>
                <p className="mt-2 text-sm font-light leading-5.625 text-brand-muted">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
