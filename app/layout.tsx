import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

/*
 * تاجوال خط الهوية للعربية واللاتينية. ليس خطاً متغيّراً، وأوزانه المتاحة
 * 200 و300 و400 و500 و700 و800 و900 (لا يوجد 600).
 * optional يمنع استبدال الخط بعد الرسم الأول حتى لا يتحرك التخطيط.
 * preload معطّل لأن تحميل كل الأوزان مسبقاً يثقل الصفحة.
 */
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "optional",
  adjustFontFallback: true,
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "تصميم وتطوير المواقع",
  alternates: { canonical: "/" },
  keywords: [
    "تصميم مواقع",
    "تطوير مواقع",
    "صفحات هبوط",
    "مهندس حاسب",
    "وائل العلوش",
    siteConfig.nameEn,
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    images: [
      {
        url: "/brand/logo-on-dark.png",
        width: 1024,
        height: 1024,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/brand/logo-on-dark.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${tajawal.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
