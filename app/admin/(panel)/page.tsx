import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import { contentCounts } from "@/lib/admin/store";

export default async function AdminHomePage() {
  await requireAdmin();
  const counts = await contentCounts();

  const sections = [
    { label: "المقالات", href: "/admin/posts", add: "مقال جديد", ...counts.posts },
    { label: "الخدمات", href: "/admin/services", add: "خدمة جديدة", ...counts.services },
    { label: "المشاريع", href: "/admin/projects", add: "مشروع جديد", ...counts.projects },
  ];

  return (
    <>
      <PageHeader
        title="لوحة التحكم"
        description="كل ما تحفظه يظهر في الموقع والسايت ماب فوراً. نماذج الإضافة تتبع معايير المحتوى والسيو المعتمدة."
      />
      <ul className="grid gap-5 md:grid-cols-3">
        {sections.map((section) => (
          <li
            key={section.href}
            className="surface-border rounded-brand-xl bg-brand-surface p-5 sm:p-6"
          >
            <h2 className="text-lg font-extrabold text-brand-cream">{section.label}</h2>
            <p className="mt-3 text-5xl font-extrabold text-brand-cream">
              {section.published}
            </p>
            <p className="mt-1 text-sm text-brand-muted">
              منشور
              {section.draft > 0 ? ` · ${section.draft} مسودة` : ""}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`${section.href}/new`} size="sm">
                {section.add}
              </Button>
              <Button href={section.href} variant="secondary" size="sm">
                إدارة
              </Button>
            </div>
          </li>
        ))}
        <li className="surface-border rounded-brand-xl bg-brand-surface p-5 sm:p-6 md:col-span-3">
          <h2 className="text-lg font-extrabold text-brand-cream">التواصل والإعلانات</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-brand-muted">
            رقم الجوال، واتساب، حسابات التواصل، وGoogle Tag Manager وبكسلات Meta وTikTok وSnapchat وLinkedIn وGoogle Ads وMicrosoft Clarity.
          </p>
          <div className="mt-6">
            <Button href="/admin/channels" size="sm">
              إدارة القنوات
            </Button>
          </div>
        </li>
      </ul>
    </>
  );
}
