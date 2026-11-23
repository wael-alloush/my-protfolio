import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { HeadingLines } from "@/components/ui/RichText";
import { home } from "@/content/ar";
import { siteConfig } from "@/lib/site";

/** نجمة زخرفية بستة أذرع خلف بداية العنوان */
function Asterisk() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="pointer-events-none absolute -start-6 top-0 h-5 w-5 rotate-12 fill-brand-accent lg:-start-10 lg:top-1 lg:h-8 lg:w-8"
      aria-hidden
    >
      {[0, 60, 120].map((angle) => (
        <rect
          key={angle}
          x="27"
          y="3"
          width="10"
          height="58"
          rx="1.5"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}
    </svg>
  );
}

export function FinalCta({
  title,
  button = home.cta.button,
}: {
  /** عنوان نصي بسيط للصفحات الداخلية؛ بدونه يظهر عنوان الصفحة الرئيسية */
  title?: string;
  button?: string;
}) {
  return (
    <section className="pb-14 pt-20 lg:pb-[52px] lg:pt-[130px]">
      <Container>
        <Reveal>
          <div className="surface-border rounded-brand-lg px-6 py-16 text-center sm:rounded-brand-2xl lg:py-[100px]">
            <h2 className="relative isolate mx-auto w-fit text-[1.75rem] leading-[1.6] sm:text-4xl sm:leading-[1.6] lg:text-[2.875rem] lg:leading-[70px]">
              <Asterisk />
              {title ? (
                <span className="font-extrabold text-brand-cream">{title}</span>
              ) : (
                <HeadingLines lines={home.cta.titleLines} />
              )}
            </h2>
            <Button
              href={siteConfig.social.whatsapp}
              variant="primary"
              size="lg"
              className="mt-10 lg:mt-[70px] lg:h-[52px]"
            >
              {button}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
