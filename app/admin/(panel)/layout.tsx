import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { Notice, PageHeader } from "@/components/admin/ui";
import { LogoMark } from "@/components/ui/Logo";
import { requireAdmin } from "@/lib/admin/auth";
import { dbProblem } from "@/lib/db";
import Link from "next/link";
import type { ReactNode } from "react";

const headerLink =
  "flex h-9 items-center rounded-pill px-3 text-sm font-medium text-brand-muted transition duration-brand hover:text-brand-cream";

const SETTINGS = "DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD";

/** شرح أشهر أسباب فشل الاتصال، حسب رمز الخطأ. */
function explain(code: string) {
  if (code === "ER_ACCESS_DENIED_ERROR") {
    return "اسم المستخدم أو كلمة المرور غير صحيحة (DB_USER / DB_PASSWORD).";
  }
  if (code === "ER_DBACCESS_DENIED_ERROR") {
    return "المستخدم لا يملك صلاحية على هذه القاعدة. اربطه بها من لوحة الاستضافة.";
  }
  if (code === "ER_BAD_DB_ERROR") return "اسم القاعدة غير صحيح (DB_NAME).";
  if (["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "EHOSTUNREACH"].includes(code)) {
    return "تعذّر الوصول إلى خادم القاعدة. تحقق من DB_HOST و DB_PORT.";
  }
  return "تحقق من أن القاعدة تعمل ومن صحة بيانات الاتصال.";
}

function DatabaseProblem({ configured, code }: { configured: boolean; code: string }) {
  if (!configured) {
    return (
      <>
        <PageHeader title="قاعدة البيانات غير مضبوطة" />
        <Notice>
          اللوحة تحفظ المحتوى في قاعدة بيانات MySQL. أنشئ قاعدة من لوحة الاستضافة، ثم أضف
          هذه المتغيّرات في إعدادات الموقع وأعد تشغيله:{" "}
          <code dir="ltr" className="text-brand-cream">{SETTINGS}</code>. الجداول تُنشأ
          تلقائياً ويُنقل إليها محتوى الموقع الحالي عند أول اتصال. إلى ذلك الحين يعمل
          الموقع العام من ملفات المحتوى كما هو.
        </Notice>
      </>
    );
  }

  return (
    <>
      <PageHeader title="تعذّر الاتصال بقاعدة البيانات" />
      <Notice tone="error">
        {explain(code)} رمز الخطأ: <code dir="ltr">{code}</code>. بعد تصحيح المتغيّرات (
        <code dir="ltr">{SETTINGS}</code>) أعد تشغيل الموقع ثم حدّث هذه الصفحة. الموقع
        العام يبقى معروضاً بآخر نسخة محفوظة.
      </Notice>
    </>
  );
}

export default async function PanelLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const problem = await dbProblem();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-site flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 sm:px-6 lg:flex-nowrap lg:py-3">
          <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
            <LogoMark eager className="h-7" />
            <span className="font-extrabold text-brand-cream">لوحة التحكم</span>
          </Link>
          <div className="order-last w-full min-w-0 lg:order-none lg:w-auto lg:flex-1">
            <AdminNav />
          </div>
          <div className="ms-auto flex items-center">
            <a href="/" target="_blank" rel="noopener noreferrer" className={headerLink}>
              عرض الموقع
            </a>
            <form action={logout}>
              <button type="submit" className={headerLink}>
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-site flex-1 px-4 py-8 sm:px-6">
        {problem ? <DatabaseProblem {...problem} /> : children}
      </main>
    </>
  );
}
