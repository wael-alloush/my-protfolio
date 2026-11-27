import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { home } from "@/content/ar";

export function Process() {
  const { process } = home;

  return (
    <section className="pt-20 lg:pt-24">
      <Container>
        <Reveal>
          <div className="relative flex items-center justify-center">
            <span
              className="line-fade absolute inset-x-0 top-1/2 h-px lg:inset-x-[5%]"
              aria-hidden
            />
            <h2 className="badge-quiet relative">{process.title}</h2>
          </div>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 min-[30rem]:grid-cols-2 lg:mt-12 lg:flex lg:justify-between lg:px-6">
          {process.steps.map((step, i) => (
            <li key={step.lead}>
              <Reveal delay={i * 0.08} className="text-start">
                <span
                  className="block w-fit overflow-visible bg-linear-to-b from-brand-secondary to-brand-secondary/5 bg-clip-text pt-[0.12em] text-[5.5rem] font-bold leading-[0.9] text-transparent select-none sm:text-[6.5rem] lg:text-[7.5rem]"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <h3 className="relative mt-2 text-h3 text-brand-cream">
                  {step.lead}{" "}
                  <span className="text-brand-cream">{step.accent}</span>
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
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
