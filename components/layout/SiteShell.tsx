import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TrackingScripts } from "@/components/layout/TrackingScripts";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessJsonLd, personJsonLd, websiteJsonLd } from "@/lib/seo";
import { getSiteConfig } from "@/lib/settings";
import type { ReactNode } from "react";

/** إطار الموقع العام: الشريط العلوي والتذييل وبيانات النشاط. لوحة التحكم لا تستخدمه. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const site = await getSiteConfig();

  return (
    <>
      <TrackingScripts ads={site.ads} />
      <JsonLd data={[personJsonLd(site), businessJsonLd(site), websiteJsonLd(site)]} />
      <Header whatsappUrl={site.social.whatsapp} />
      <main className="flex-1 pt-20 lg:pt-26">{children}</main>
      <Footer site={site} />
    </>
  );
}
