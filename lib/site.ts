const envPhone = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966561742364"
).replace(/\D/g, "");

export type SocialKey =
  | "instagram"
  | "linkedin"
  | "github"
  | "x"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "snapchat";

export type SocialLinks = Record<SocialKey, string>;

export type AdsConfig = {
  gtmId: string;
  googleAdsId: string;
  metaPixelId: string;
  tiktokPixelId: string;
  snapchatPixelId: string;
  linkedinPartnerId: string;
  clarityId: string;
};

export type SiteConfig = {
  brand: string;
  brandTagline: string;
  name: string;
  nameEn: string;
  title: string;
  description: string;
  url: string;
  locale: string;
  phone: string;
  email: string;
  social: SocialLinks & { whatsapp: string };
  ads: AdsConfig;
};

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: "إنستغرام",
  linkedin: "لينكدإن",
  github: "GitHub",
  x: "X",
  facebook: "فيسبوك",
  youtube: "يوتيوب",
  tiktok: "تيك توك",
  snapchat: "سناب شات",
};

export const defaultSocial: SocialLinks = {
  instagram: "https://www.instagram.com/wa4web",
  linkedin: "",
  github: "",
  x: "",
  facebook: "",
  youtube: "",
  tiktok: "",
  snapchat: "",
};

export const defaultAds: AdsConfig = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  googleAdsId: "",
  metaPixelId: "",
  tiktokPixelId: "",
  snapchatPixelId: "",
  linkedinPartnerId: "",
  clarityId: "",
};

/** القيم الافتراضية قبل أي تعديل من لوحة التحكم. */
export const siteDefaults: SiteConfig = {
  brand: "WA STUDIO",
  brandTagline: "تصميم وتطوير المواقع",
  name: "وائل العلوش",
  nameEn: "Wael Al-Alloush",
  title: "وائل العلوش | مصمم مواقع الكترونية في السعودية — تصميم مواقع",
  description:
    "مصمم مواقع في السعودية — الرياض، جدة، والدمام. أصمّم مواقع للشركات والعيادات، صفحات هبوط، وإعادة تصميم المواقع. أسعار مناسبة وتسليم سريع، والاتفاق عبر واتساب.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://waelaloush.com").replace(
    /\/+$/,
    "",
  ),
  locale: "ar_SA",
  phone: envPhone,
  email: "waelee2018@gmail.com",
  social: {
    ...defaultSocial,
    whatsapp: envPhone ? `https://wa.me/${envPhone}` : "",
  },
  ads: defaultAds,
};

/** توافق مع الاستيرادات القديمة؛ يفضَّل getSiteConfig() للقراءة الحيّة. */
export const siteConfig = siteDefaults;

export function whatsappUrl(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export function activeSocialLinks(site: SiteConfig) {
  const entries: { key: string; label: string; href: string }[] = [];
  if (site.social.whatsapp) {
    entries.push({ key: "whatsapp", label: "WhatsApp", href: site.social.whatsapp });
  }
  for (const key of Object.keys(SOCIAL_LABELS) as SocialKey[]) {
    const href = site.social[key]?.trim();
    if (href) entries.push({ key, label: SOCIAL_LABELS[key], href });
  }
  return entries;
}
