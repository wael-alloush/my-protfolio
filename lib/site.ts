const whatsappNumber = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966561742364"
).replace(/\D/g, "");

export const siteConfig = {
  /** اسم العلامة كما في لوحة الهوية — يظهر بجانب الشعار */
  brand: "WA STUDIO",
  brandTagline: "تصميم وتطوير المواقع",
  /** الاسم الشخصي الظاهر في التحية وتذييل الموقع وبيانات SEO */
  name: "وائل العلوش",
  nameEn: "Wael Al-Alloush",
  title: "وائل العلوش | مصمم مواقع الكترونية في السعودية — تصميم مواقع",
  description:
    "مصمم مواقع في السعودية — الرياض، جدة، والدمام. أصمّم مواقع تعريفية للشركات، صفحات هبوط عالية التحويل، وإعادة تصميم المواقع. استشارة مجانية، تصميم عصري، وسرعة تحميل عالية.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://waelaloush.com").replace(
    /\/+$/,
    "",
  ),
  locale: "ar_SA",
  phone: whatsappNumber,
  social: {
    linkedin: "https://www.linkedin.com/",
    x: "https://x.com/",
    instagram: "https://www.instagram.com/",
    whatsapp: `https://wa.me/${whatsappNumber}`,
  },
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
} as const;
