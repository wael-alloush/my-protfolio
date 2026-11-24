import type { Metadata } from "next";
import type { ReactNode } from "react";

// اللوحة خاصة: لا تُفهرس ولا تحمل رابطاً أساسياً يشير إلى الموقع العام.
export const metadata: Metadata = {
  title: { default: "لوحة التحكم", template: "%s | لوحة التحكم" },
  description: "إدارة محتوى الموقع.",
  alternates: {},
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col bg-brand-background">{children}</div>;
}
