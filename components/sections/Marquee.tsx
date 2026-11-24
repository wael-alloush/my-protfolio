import { home } from "@/content/ar";

/* تكرار العبارات داخل كل نسخة حتى يغطي الشريط أعرض الشاشات */
const REPEAT = 4;

function Sparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mx-7 h-6 w-6 shrink-0 fill-brand-cream sm:h-7 sm:w-7"
      aria-hidden
    >
      <path d="M12 1c.9 6.2 4.8 10.1 11 11-6.2.9-10.1 4.8-11 11-.9-6.2-4.8-10.1-11-11 6.2-.9 10.1-4.8 11-11z" />
    </svg>
  );
}

export function Marquee() {
  const phrases = Array.from({ length: REPEAT }, () => home.marquee).flat();

  return (
    <div className="overflow-hidden border-y border-brand-border/60 bg-brand-card/60 py-3 lg:py-4">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1}
          >
            {phrases.map((phrase, i) => (
              <li
                key={i}
                className="flex items-center whitespace-nowrap text-lg font-light leading-8.75 text-brand-cream sm:text-[1.5625rem]"
              >
                {phrase}
                <Sparkle />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
