import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { home } from "@/content/ar";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

export const metadata = createMetadata({
  title: "عن وائل العلوش",
  description:
    "وائل العلوش مهندس حاسب ومصمم مواقع في السعودية. أصمّم موقعاً إلكترونياً وصفحة هبوط، وأحسّن الظهور في محركات البحث.",
  path: "/about",
});

export default function AboutPage() {
  const { about } = home;

  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="relative mx-auto h-38.25 w-38.25 overflow-hidden rounded-full border-2 border-brand-accent bg-brand-primary">
          <Image
            src="/brand/wael.jpg"
            alt={`${about.photoAlt}: ${siteConfig.name}`}
            fill
            sizes="153px"
            className="object-cover object-[50%_22%]"
          />
        </div>
        <p className="mt-4 text-lg font-light text-brand-muted">
          {about.greetingPrefix} {siteConfig.name}
        </p>
        <h1 className="mt-4 text-3xl font-medium text-brand-cream sm:text-5xl">
          مهندس حاسب ومصمم مواقع
        </h1>
        <p className="mt-6 text-lg font-light leading-8 text-brand-muted">
          مهندس حاسب ومصمم مواقع في السعودية. أعمل مع شركات ومكاتب وعيادات
          ومطاعم وأنشطة أخرى تحتاج حضوراً رقمياً واضحاً. خلال أكثر من 3 سنوات
          نفّذت أكثر من 30 مشروعاً، منها مواقع لد. لطيفة الخرافي ومكتب المحامي
          ماجد الصقعبي ومطاعم الباب الشرقي.
        </p>
        <p className="mt-4 text-lg font-light leading-8 text-brand-muted">
          أركّز على ثلاث خدمات: تصميم موقع إلكتروني، تصميم صفحة هبوط، وتحسين
          الظهور في محركات البحث. العمل يمر بتحديد المتطلبات، ثم الواجهات، ثم
          التطوير، ثم النشر مع الدعم حسب الاتفاق. السعر يُتفق عليه عبر واتساب
          قبل البدء.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="primary">
            تواصل
          </Button>
          <Button href="/services" variant="secondary">
            الخدمات
          </Button>
          <Button href="/portfolio" variant="secondary">
            الأعمال
          </Button>
        </div>
        <p className="mt-8 text-sm text-brand-muted">
          <Link href="/terms" className="underline hover:text-brand-accent">
            شروط العمل
          </Link>
        </p>
      </div>
    </Container>
  );
}
