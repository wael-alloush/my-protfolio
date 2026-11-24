import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/lib/settings";
import { activeSocialLinks } from "@/lib/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "تواصل",
  description:
    "تواصل مع وائل العلوش مباشرة عبر واتساب لطلب تصميم موقع. الهاتف والبريد وحسابات التواصل متاحة أيضاً.",
  path: "/contact",
});

export default async function ContactPage() {
  const site = await getSiteConfig();
  const phone = `+${site.phone}`;
  const social = activeSocialLinks(site).filter((item) => item.key !== "whatsapp");

  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-medium text-brand-cream sm:text-5xl">تواصل</h1>
        <p className="mt-5 text-lg font-light leading-8 text-brand-muted">
          لا يوجد نموذج على الموقع. اطلب موقعك مباشرة عبر واتساب، ونتفق على
          نطاق العمل والسعر قبل البدء.
        </p>
        {site.social.whatsapp ? (
          <Button href={site.social.whatsapp} variant="primary" className="mt-8">
            واتساب
          </Button>
        ) : null}
        <dl className="mt-10 space-y-4 text-brand-cream">
          {site.phone ? (
            <div>
              <dt className="text-sm text-brand-muted">الهاتف</dt>
              <dd>
                <a href={`tel:${phone}`} className="hover:text-brand-accent" dir="ltr">
                  {phone}
                </a>
              </dd>
            </div>
          ) : null}
          {site.email ? (
            <div>
              <dt className="text-sm text-brand-muted">البريد</dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-brand-accent"
                  dir="ltr"
                >
                  {site.email}
                </a>
              </dd>
            </div>
          ) : null}
          {social.map((item) => (
            <div key={item.key}>
              <dt className="text-sm text-brand-muted">{item.label}</dt>
              <dd>
                <a
                  href={item.href}
                  className="hover:text-brand-accent"
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                >
                  {item.href.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-sm text-brand-muted">
          <Link href="/about" className="underline hover:text-brand-accent">
            عنّي
          </Link>
          {" · "}
          <Link href="/terms" className="underline hover:text-brand-accent">
            الشروط
          </Link>
        </p>
      </div>
    </Container>
  );
}
