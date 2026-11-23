import { Container } from "@/components/ui/Container";
import { NavLink } from "@/components/ui/NavLink";
import { footer } from "@/content/ar";
import { siteConfig } from "@/lib/site";

const social = [
  { label: "Instagram", href: siteConfig.social.instagram, icon: InstagramIcon },
  { label: "WhatsApp", href: siteConfig.social.whatsapp, icon: WhatsAppIcon },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-surface text-brand-cream">
      <Container className="grid gap-10 py-12 md:grid-cols-[4fr_3fr_3fr] md:gap-0 md:pb-10 md:pt-12">
        <div className="md:px-2.5">
          <p className="text-lg leading-8">
            {footer.credit} {siteConfig.name}
          </p>
          <p className="mt-2.5 text-[0.8125rem] font-light leading-[22px] text-brand-muted">
            © {year} {footer.copyright}
          </p>
        </div>

        <nav aria-label={footer.linksTitle} className="md:px-2.5">
          <h2 className="text-[1.375rem] font-medium leading-[38px]">
            {footer.linksTitle}
          </h2>
          <ul className="mt-[11px] flex flex-col">
            {footer.links.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  className="flex h-[46px] items-center transition duration-brand hover:text-brand-accent"
                  idleClassName="font-light text-brand-muted"
                  activeClassName="font-medium text-brand-accent"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <ul
          className="flex items-start gap-3 md:justify-end md:px-2.5"
          aria-label={footer.socialLabel}
        >
          {social.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[50px] w-[50px] items-center justify-center rounded-full border border-brand-secondary text-brand-cream transition duration-brand hover:border-brand-accent hover:text-brand-accent"
                aria-label={label}
              >
                <Icon />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A11.9 11.9 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.85c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.67a11.9 11.9 0 0 0 5.65 1.44h.01c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.23-6.15-3.41-8.42zM12.06 21.2h-.01a9.3 9.3 0 0 1-4.74-1.3l-.34-.2-3.8 1 1.01-3.7-.22-.38a9.3 9.3 0 0 1-1.43-4.97c0-5.14 4.19-9.33 9.34-9.33 2.49 0 4.83.97 6.59 2.73a9.27 9.27 0 0 1 2.73 6.6c0 5.14-4.19 9.33-9.33 9.33zm5.12-7c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.63.14-.19.28-.72.91-.88 1.1-.16.18-.33.21-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.91-.16-.28-.02-.43.12-.57.13-.12.28-.33.42-.49.14-.16.19-.28.28-.47.1-.18.05-.35-.02-.49-.07-.14-.63-1.52-.87-2.08-.23-.55-.46-.47-.63-.48h-.54c-.19 0-.49.07-.75.35-.26.28-1 1-1 2.43s1.02 2.82 1.16 3.01c.14.19 2.01 3.07 4.87 4.31.68.29 1.21.47 1.62.6.68.21 1.3.18 1.79.11.55-.08 1.66-.68 1.9-1.34.23-.65.23-1.21.16-1.33-.07-.12-.26-.19-.54-.33z" />
    </svg>
  );
}
