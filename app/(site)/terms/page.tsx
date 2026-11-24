import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "الشروط",
  description:
    "شروط طلب تصميم موقع من وائل العلوش: الاتفاق عبر واتساب، نطاق العمل، التسليم، وحقوق المحتوى.",
  path: "/terms",
});

const sections = [
  {
    title: "من يقدّم الخدمة",
    body: `${siteConfig.name} يقدّم تصميم وتطوير المواقع تحت العلامة ${siteConfig.brand} عبر ${siteConfig.url}. التواصل الرسمي يتم من صفحة التواصل أو واتساب.`,
  },
  {
    title: "الاتفاق والسعر",
    body: "لا تُعرض أسعار ثابتة على الموقع. نطاق العمل والمدة والسعر يُتفق عليها كتابةً عبر واتساب قبل البدء، ولا يبدأ التنفيذ قبل هذا الاتفاق.",
  },
  {
    title: "ما يشمله العمل",
    body: "يشمل الاتفاق ما يُذكر فيه فقط: نوع الموقع، الصفحات، واللغة. أي إضافة لاحقة تُسعَّر بشكل منفصل قبل تنفيذها.",
  },
  {
    title: "محتوى العميل",
    body: "النصوص والصور والشعارات التي يزوّدني بها العميل تبقى مسؤوليته. أستخدمها لبناء الموقع المتفق عليه ولا أدّعي ملكيتها.",
  },
  {
    title: "التسليم",
    body: "يُسلَّم الموقع بعد اكتمال النطاق المتفق عليه ومراجعته. الاستضافة والنطاق يمكن ترتيبهما ضمن الاتفاق أو يبقيهما العميل على حسابه.",
  },
  {
    title: "أعمال المعرض",
    body: "المشاريع المعروضة في صفحة الأعمال أمثلة من تنفيذ سابق. نشرها للتعريف بالتجربة، وحقوق كل موقع تبقى حسب اتفاق ذلك المشروع.",
  },
] as const;

export default function TermsPage() {
  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-medium text-brand-cream sm:text-5xl">الشروط</h1>
        <p className="mt-5 text-lg font-light leading-8 text-brand-muted">
          هذه الشروط توضّح كيف يُطلب تصميم الموقع وكيف يُسلَّم. باستخدام الموقع
          أو طلب الخدمة فأنت تطلع عليها.
        </p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-medium text-brand-cream">{section.title}</h2>
              <p className="mt-2 font-light leading-8 text-brand-muted">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-brand-muted">
          <Link href="/contact" className="underline hover:text-brand-accent">
            تواصل
          </Link>
          {" · "}
          <Link href="/about" className="underline hover:text-brand-accent">
            عنّي
          </Link>
        </p>
      </div>
    </Container>
  );
}
