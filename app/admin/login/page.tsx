import { LoginForm } from "@/components/admin/LoginForm";
import { Notice } from "@/components/admin/ui";
import { LogoMark } from "@/components/ui/Logo";
import { isAdmin, isAdminConfigured } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "تسجيل الدخول" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-brand border border-brand-border bg-brand-surface p-6 sm:p-8">
        <LogoMark eager className="mx-auto h-10" />
        <h1 className="mt-5 text-center text-2xl font-extrabold text-brand-cream">
          لوحة التحكم
        </h1>
        <p className="mb-6 mt-1 text-center text-sm text-brand-muted">
          إدارة المقالات والخدمات والمشاريع
        </p>
        {isAdminConfigured() ? (
          <LoginForm />
        ) : (
          <Notice>
            اللوحة مقفلة حتى تُضبط كلمة المرور. أضف المتغيّر{" "}
            <code dir="ltr" className="text-brand-cream">ADMIN_PASSWORD</code> (8 أحرف على
            الأقل) في إعدادات الاستضافة ثم أعد تشغيل الموقع.
          </Notice>
        )}
      </div>
    </main>
  );
}
