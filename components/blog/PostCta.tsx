import { Button } from "@/components/ui/Button";
import { blogPage } from "@/content/ar";
import { getSiteConfig } from "@/lib/settings";
import Link from "next/link";

/** يوجّه قارئ المقال إلى الخدمة المناسبة ثم واتساب دون حشو. */
export function serviceLinkForPost(slug: string): { href: string; label: string } {
  if (slug.includes("landing")) {
    return { href: "/services/landing-pages", label: "تصميم صفحة هبوط" };
  }
  if (slug.includes("seo") || slug.includes("search") || slug.includes("cost")) {
    return { href: "/services/search-visibility", label: "تحسين الظهور في محركات البحث" };
  }
  return {
    href: "/services/corporate-websites",
    label: "تصميم موقع إلكتروني",
  };
}

export async function PostCta({ slug }: { slug: string }) {
  const site = await getSiteConfig();
  const service = serviceLinkForPost(slug);

  return (
    <aside className="surface-border mt-14 rounded-brand-xl px-6 py-8 sm:mt-16 sm:px-8 sm:py-10">
      <p className="text-h3 text-brand-cream">{blogPage.postCtaTitle}</p>
      <p className="mt-3 max-w-xl leading-8 text-brand-text-soft">{blogPage.postCtaBody}</p>
      <p className="mt-4 text-sm leading-7 text-brand-muted">
        أو اطلع على{" "}
        <Link
          href={service.href}
          className="font-medium text-brand-accent transition duration-brand hover:underline"
        >
          {service.label}
        </Link>
        {" · "}
        <Link
          href="/portfolio"
          className="font-medium text-brand-accent transition duration-brand hover:underline"
        >
          نماذج الأعمال
        </Link>
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        {site.social.whatsapp ? (
          <Button href={site.social.whatsapp} variant="primary">
            {blogPage.postCtaWhatsapp}
          </Button>
        ) : null}
        <Button href="/blog" variant="secondary">
          {blogPage.postCtaBack}
        </Button>
      </div>
    </aside>
  );
}
