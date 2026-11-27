export const nav = {
  links: [
    { href: "/services", label: "الخدمات" },
    { href: "/portfolio", label: "أعمالي" },
    { href: "/blog", label: "المدونة" },
  ],
  contact: "اطلب موقعك",
  cta: "اطلب تصميم موقعك",
} as const;

/** مقطع نصي بنبرة بصرية: خفيف / عريض / عريض بلون التأكيد */
export type TextTone = "light" | "strong" | "accent";
export type TextSegment = { readonly text: string; readonly tone?: TextTone };

export const home = {
  hero: {
    line1: "أصمّم مواقع الكترونية",
    line2: { before: "تسهّل الحجز وتزيد", accent: "الطلبات" },
    body: [
      { text: "أنا " },
      { text: "مصمم مواقع في السعودية", tone: "strong" },
      { text: "، أعمل غالباً مع العيادات وأصحاب المشاريع في الرياض وجدة والدمام. أقدّم " },
      { text: "تصميم مواقع الكترونية", tone: "strong" },
      { text: " واضحة على الجوال، بأسعار مناسبة وتسليم سريع، حتى يصل الزائر لحجز استشارة أو رسالة واتساب بسهولة." },
    ],
    primaryCta: "شاهد أعمالي",
    primaryHref: "/portfolio",
    secondaryCta: "تعرّف على خدماتي",
    secondaryHref: "/services",
  },
  marquee: [
    "موقع عيادة يوضّح الخدمات ويفتح مسار الحجز",
    "صفحة هبوط جاهزة لحملتك الإعلانية",
    "تسليم سريع وأسعار واضحة عبر واتساب",
  ],
  features: {
    titleLines: [
      [
        { text: "الموقع الجيد", tone: "light" },
        { text: "يجلب حجزاً", tone: "strong" },
      ],
      [
        { text: "أو طلباً", tone: "accent" },
        { text: "لا إعجاباً فقط", tone: "light" },
      ],
    ],
    subtitle:
      "هذا ما أبنيه لك عملياً عند طلب تصميم موقع شركة أو عيادة أو حملة صفحات هبوط",
    items: [
      {
        title: "موقع بمحتوى ووظيفة تناسبك",
        description:
          "أبني لك موقع الكتروني يعرض خدماتك ويوجّه الزائر لخطوة واضحة: حجز استشارة أو تواصل واتساب، بدل صفحات عامة بلا هدف.",
        href: "/services/corporate-websites",
        linkLabel: "تفاصيل الخدمة",
        featured: false,
      },
      {
        title: "صفحات هبوط",
        description:
          "صفحة واحدة لكل عرض إعلاني: وعد واضح، مزايا مختصرة، وزر واحد نحو الطلب أو الحجز.",
        href: "/services/landing-pages",
        linkLabel: "تفاصيل الخدمة",
        featured: true,
      },
      {
        title: "تصميم يعكس هويتك",
        description:
          "ألوانك وشعارك وأسلوبك في الواجهة، مع ترتيب يسهّل قراءة الخدمات على الجوال قبل أي شيء آخر.",
        href: "/services",
        linkLabel: "كل الخدمات",
        featured: false,
      },
    ],
  },
  portfolio: {
    badge: "من أعمالي المنشورة",
    title: "مواقع لعيادات ومكاتب ومشاريع تعمل اليوم",
    titleLines: [
      [
        { text: "مواقع لعيادات", tone: "light" },
        { text: "ومكاتب", tone: "strong" },
      ],
      [
        { text: "تراها", tone: "light" },
        { text: "تعمل الآن", tone: "accent" },
      ],
    ],
    cta: "شاهد أعمالي",
    thumbAlt: "معاينة مشروع",
  },
  about: {
    greetingPrefix: "مرحباً، أنا",
    photoAlt: "الصورة الشخصية",
    titleLines: [
      [
        { text: "مهندس حاسب", tone: "light" },
        { text: "ومصمم مواقع", tone: "accent" },
      ],
      [
        { text: "بخبرة +3", tone: "strong" },
        { text: "سنوات", tone: "light" },
      ],
    ],
    body: [
      { text: "أصمّم وأطوّر المواقع في السعودية، وأركّز على " },
      { text: "العيادات", tone: "strong" },
      { text: " وأصحاب المشاريع الذين يحتاجون حضوراً واضحاً على الجوال. نفّذت " },
      { text: "أكثر من 30 مشروعاً", tone: "strong" },
      { text: "، منها مواقع لد. لطيفة الخرافي ومكتب المحامي ماجد الصقعبي ومطاعم الباب الشرقي. أميّز عملي " },
      { text: "بالتسليم السريع والأسعار المناسبة", tone: "strong" },
      { text: "، والهدف عادةً زيادة حجوزات الاستشارة أو طلبات التواصل." },
    ],
  },
  process: {
    title: "كيف نعمل معاً",
    steps: [
      {
        lead: "تحديد",
        accent: "المتطلبات",
        description:
          "نحدّد هدف الموقع والزائر المطلوب: حجز استشارة، واتساب، أو عرض خدمات العيادة.",
      },
      {
        lead: "تصميم",
        accent: "الواجهات",
        description:
          "أصمّم الواجهات على الجوال أولاً، بهويتك وترتيب واضح للخدمات وأزرار الحجز.",
      },
      {
        lead: "تطوير",
        accent: "الموقع",
        description:
          "أبني الموقع بسرعة مناسبة وروابط تواصل تعمل، جاهزاً للاستخدام اليومي.",
      },
      {
        lead: "النشر",
        accent: "والدعم",
        description:
          "أنشر الموقع وأسلّمك الصلاحيات، وأبقى للدعم بعد الإطلاق حسب اتفاقنا.",
      },
    ],
  },
  cta: {
    titleLines: [
      [
        { text: "هل تريد موقعاً", tone: "light" },
        { text: "يوضّح خدماتك", tone: "strong" },
      ],
      [
        { text: "ويسهّل", tone: "light" },
        { text: "الحجز من الجوال؟", tone: "accent" },
      ],
    ],
    button: "اطلب تصميم موقعك",
  },
} as const;

export const footer = {
  credit: "مصمم ومطور المواقع:",
  copyright: "جميع الحقوق محفوظة",
  linksTitle: "روابط الموقع:",
  links: [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "عنّي" },
    { href: "/services", label: "الخدمات" },
    { href: "/portfolio", label: "الأعمال" },
    { href: "/blog", label: "المدونة" },
    { href: "/contact", label: "تواصل" },
    { href: "/terms", label: "الشروط" },
  ],
  socialLabel: "حسابات التواصل",
} as const;

export const servicesPage = {
  hero: {
    title: "خدمات تصميم مواقع تناسب عيادتك أو مشروعك",
    subtitle:
      "أصمّم مواقع تعريفية وصفحات هبوط وإعادة تصميم للمواقع البطيئة أو غير الواضحة — بتركيز على الجوال والحجز أو طلب واتساب.",
  },
  stats: [
    { label: "مشروع تم تنفيذه", value: "+30" },
    { label: "سنوات خبرة", value: "+3" },
  ],
  title: "ماذا أقدّم في تصميم المواقع",
  subtitle:
    "تصميم موقع شركة أو عيادة، صفحات هبوط للحملات، وتحديث المواقع الحالية — وبتسليم سريع واتفاق سعر عبر واتساب. إن احتجت لاحقاً تصميم متجر الكتروني نناقش النطاق قبل البدء.",
  items: [
    {
      title: "تصميم مواقع للشركات والعيادات",
      description:
        "موقع يعرض خدماتك وفريقك ومسار الحجز أو التواصل بوضوح، خاصة للعيادات والمكاتب في السعودية.",
      href: "/services/corporate-websites",
    },
    {
      title: "صفحات هبوط",
      description:
        "صفحة مرتبطة بإعلانك: عرض واحد وزر واحد نحو استشارة أو طلب، دون تشتيت في قائمة صفحات طويلة.",
      href: "/services/landing-pages",
    },
    {
      title: "إعادة تصميم المواقع",
      description:
        "إذا كان موقعك بطيئاً أو غير مناسب للجوال أو لا يشرح خدماتك، نعيد بناءه بهيكل أوضح وهدف محدد.",
      href: "/services/website-redesign",
    },
  ],
} as const;

export const portfolioPage = {
  title: "نماذج من مواقع صمّمتها",
  subtitle:
    "من عيادة تقويم أسنان إلى مطعم وشركة استشارات مالية — مواقع منشورة يمكن فتحها ومراجعتها بنفسك.",
  filterAll: "الكل",
  categories: ["موقع الكتروني متكامل", "صفحة هبوط", "نظام مخصص"],
  empty: "لا توجد أعمال في هذا التصنيف بعد.",
} as const;

export const blogPage = {
  title: "مدونة تصميم وتطوير المواقع",
  titleBefore: "مقالات",
  titleStrong: "عملية",
  titleAfter: "عن",
  titleAccent: "تصميم المواقع",
  subtitle:
    "مقالات عن اختيار مصمم مواقع في السعودية، تكلفة الموقع، صفحات الهبوط، ومتى تحتاج تصميم متجر الكتروني.",
  readMore: "اقرأ المقالة",
  postCtaTitle: "هل تريد موقعاً واضحاً على الجوال؟",
  postCtaBody:
    "حدّد هدفك عبر واتساب، ونتفق على النطاق والسعر قبل البدء.",
  postCtaWhatsapp: "اطلب تصميم موقعك",
  postCtaBack: "العودة للمدونة",
} as const;

export const common = {
  learnMore: "اقرأ التفاصيل",
  requestCta: "اطلب تصميم موقعك",
  backToHome: "العودة للرئيسية",
} as const;
