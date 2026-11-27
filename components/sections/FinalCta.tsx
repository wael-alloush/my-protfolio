import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { HeadingLines } from "@/components/ui/RichText";
import { home } from "@/content/ar";
import { getSiteConfig } from "@/lib/settings";

/** نجمة زخرفية بستة أذرع خلف بداية العنوان */
function Asterisk() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="pointer-events-none absolute -inset-s-6 top-0 h-5 w-5 rotate-12 fill-brand-secondary lg:-inset-s-10 lg:top-1 lg:h-8 lg:w-8"
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

export async function FinalCta({
  title,
  button = home.cta.button,
}: {
  /** عنوان نصي بسيط للصفحات الداخلية؛ بدونه يظهر عنوان الصفحة الرئيسية */
  title?: string;
  button?: string;
}) {
  const site = await getSiteConfig();

  return (
    <section className="pb-16 pt-20 lg:pb-20 lg:pt-28">
      <Container>
        <Reveal>
          <div className="surface-border rounded-brand-xl px-6 py-14 text-center sm:rounded-brand-2xl sm:py-16 lg:py-20">
            <h2 className="relative isolate mx-auto w-fit text-h2 sm:text-[2.25rem] lg:text-[2.75rem]">
              <Asterisk />
              {title ? (
                <span className="font-extrabold text-brand-cream">{title}</span>
              ) : (
                <HeadingLines lines={home.cta.titleLines} />
              )}
            </h2>
            <Button
              href={site.social.whatsapp}
              variant="primary"
              size="lg"
              className="mt-8 lg:mt-10"
            >
              {button}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
