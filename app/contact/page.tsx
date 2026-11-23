import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "تواصل",
  description:
    "تواصل مع وائل العلوش مباشرة عبر واتساب لطلب تصميم موقع. الهاتف والبريد وإنستغرام متاحة أيضاً.",
  path: "/contact",
});

const phone = `+${siteConfig.phone}`;

export default function ContactPage() {
  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-medium text-brand-cream sm:text-5xl">تواصل</h1>
        <p className="mt-5 text-lg font-light leading-8 text-brand-muted">
          لا يوجد نموذج على الموقع. اطلب موقعك مباشرة عبر واتساب، ونتفق على
          نطاق العمل والسعر قبل البدء.
        </p>
        <Button href={siteConfig.social.whatsapp} variant="primary" className="mt-8">
          واتساب
        </Button>
        <dl className="mt-10 space-y-4 text-brand-cream">
          <div>
            <dt className="text-sm text-brand-muted">الهاتف</dt>
            <dd>
              <a href={`tel:${phone}`} className="hover:text-brand-accent" dir="ltr">
                {phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-brand-muted">البريد</dt>
            <dd>
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-brand-accent"
                dir="ltr"
              >
                {siteConfig.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-brand-muted">إنستغرام</dt>
            <dd>
              <a
                href={siteConfig.social.instagram}
                className="hover:text-brand-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                instagram.com/wa4web
              </a>
            </dd>
          </div>
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
