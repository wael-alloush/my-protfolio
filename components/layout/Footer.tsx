import { Container } from "@/components/ui/Container";
import { NavLink } from "@/components/ui/NavLink";
import { footer } from "@/content/ar";
import { activeSocialLinks, type SiteConfig } from "@/lib/site";
import type { ReactNode } from "react";

export function Footer({ site }: { site: SiteConfig }) {
  const year = new Date().getFullYear();
  const social = activeSocialLinks(site);

  return (
    <footer className="bg-brand-surface text-brand-cream">
      <Container className="grid gap-10 py-12 md:grid-cols-[4fr_3fr_3fr] md:gap-0 md:pb-10 md:pt-12">
        <div className="md:px-2.5">
          <p className="text-lg leading-8">
            {footer.credit} {site.name}
          </p>
          <p className="mt-2.5 text-[0.8125rem] font-light leading-5.5 text-brand-muted">
            © {year} {footer.copyright}
          </p>
        </div>

        <nav aria-label={footer.linksTitle} className="md:px-2.5">
          <h2 className="text-[1.375rem] font-medium leading-9.5">
            {footer.linksTitle}
          </h2>
          <ul className="mt-2.75 flex flex-col">
            {footer.links.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  className="flex h-11.5 items-center transition duration-brand hover:text-brand-accent"
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
          className="flex flex-wrap items-start gap-3 md:justify-end md:px-2.5"
          aria-label={footer.socialLabel}
        >
          {social.map(({ key, label, href }) => (
            <li key={key}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12.5 w-12.5 items-center justify-center rounded-full border border-brand-secondary text-brand-cream transition duration-brand hover:border-brand-accent hover:text-brand-accent"
                aria-label={label}
              >
                <SocialIcon name={key} />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    whatsapp: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.5 3.5A11.9 11.9 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.85c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.67a11.9 11.9 0 0 0 5.65 1.44h.01c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.23-6.15-3.41-8.42zM12.06 21.2h-.01a9.3 9.3 0 0 1-4.74-1.3l-.34-.2-3.8 1 1.01-3.7-.22-.38a9.3 9.3 0 0 1-1.43-4.97c0-5.14 4.19-9.33 9.34-9.33 2.49 0 4.83.97 6.59 2.73a9.27 9.27 0 0 1 2.73 6.6c0 5.14-4.19 9.33-9.33 9.33zm5.12-7c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.63.14-.19.28-.72.91-.88 1.1-.16.18-.33.21-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.91-.16-.28-.02-.43.12-.57.13-.12.28-.33.42-.49.14-.16.19-.28.28-.47.1-.18.05-.35-.02-.49-.07-.14-.63-1.52-.87-2.08-.23-.55-.46-.47-.63-.48h-.54c-.19 0-.49.07-.75.35-.26.28-1 1-1 2.43s1.02 2.82 1.16 3.01c.14.19 2.01 3.07 4.87 4.31.68.29 1.21.47 1.62.6.68.21 1.3.18 1.79.11.55-.08 1.66-.68 1.9-1.34.23-.65.23-1.21.16-1.33-.07-.12-.26-.19-.54-.33z" />
      </svg>
    ),
    instagram: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    linkedin: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.5V23h-4V8.5z" />
      </svg>
    ),
    github: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.91-.01 3.3 0 .32.22.7.82.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    x: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.9 2H22l-6.8 7.78L23.5 22h-6.55l-5.13-6.7L6.2 22H3.1l7.28-8.32L.5 2h6.72l4.63 6.14L18.9 2zm-1.15 18h1.8L7.35 3.9H5.42L17.75 20z" />
      </svg>
    ),
    facebook: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V9c0-.9.3-1.5 1.6-1.5H16.7V4.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3V14h2.7v8h3.5z" />
      </svg>
    ),
    youtube: (
      <svg width="18" height="14" viewBox="0 0 24 18" fill="currentColor" aria-hidden>
        <path d="M23.5 3.2a3 3 0 0 0-2.1-2.1C19.5.5 12 .5 12 .5s-7.5 0-9.4.6A3 3 0 0 0 .5 3.2 31.5 31.5 0 0 0 0 9a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 9a31.5 31.5 0 0 0-.5-5.8zM9.6 12.7V5.3L15.8 9l-6.2 3.7z" />
      </svg>
    ),
    tiktok: (
      <svg width="15" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.6 7.2a6.7 6.7 0 0 1-3.9-1.2v8.1a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v2.9a3 3 0 1 0 2.1 2.9V2h2.9c.3 1.7 1.5 3.2 3.1 3.9v1.3z" />
      </svg>
    ),
    snapchat: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.1 2c2.6 0 4.8 1.9 5.2 4.5.2 1.3.1 2.6.6 3.7.3.7.9 1.3 1.5 1.8.4.3.5.7.3 1.1-.2.5-.7.7-1.2.9-.3.1-.5.3-.5.6 0 .7.7 1.2 1.3 1.6.5.3.7.8.4 1.3-.5.8-1.7 1-2.6 1.2-.4.1-.7.3-.8.7-.2.8-.8 1.4-1.5 1.8-1 .6-2.2.9-3.4.9s-2.4-.3-3.4-.9c-.7-.4-1.3-1-1.5-1.8-.1-.4-.4-.6-.8-.7-.9-.2-2.1-.4-2.6-1.2-.3-.5-.1-1 .4-1.3.6-.4 1.3-.9 1.3-1.6 0-.3-.2-.5-.5-.6-.5-.2-1-.4-1.2-.9-.2-.4-.1-.8.3-1.1.6-.5 1.2-1.1 1.5-1.8.5-1.1.4-2.4.6-3.7C7.3 3.9 9.5 2 12.1 2z" />
      </svg>
    ),
  };

  return icons[name] ?? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}
