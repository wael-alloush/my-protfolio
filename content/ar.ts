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
    line1: "تصميم موقع إلكتروني",
    line2: { before: "وصفحة هبوط", accent: "وظهور أوضح" },
    body: [
      { text: "أنا " },
      { text: "مصمم مواقع في السعودية", tone: "strong" },
      { text: "، أعمل مع شركات وأنشطة خدمية وتجارية في الرياض وجدة والدمام وغيرها. أقدّم " },
      { text: "تصميم موقع إلكتروني وصفحة هبوط", tone: "strong" },
      { text: "، مع تحسين الظهور في محركات البحث — بمحتوى مفهوم ومسارات تواصل واضحة." },
    ],
    primaryCta: "شاهد أعمالي",
    primaryHref: "/portfolio",
    secondaryCta: "تعرّف على خدماتي",
    secondaryHref: "/services",
  },
  marquee: [
    "تصميم موقع إلكتروني بنشاطك وخدماتك",
    "تصميم صفحة هبوط مرتبطة بهدف الحملة",
    "تحسين الظهور في محركات البحث",
  ],
  features: {
    titleLines: [
      [
        { text: "ثلاث خدمات", tone: "light" },
        { text: "واضحة", tone: "strong" },
      ],
      [
        { text: "لمشروعك", tone: "light" },
        { text: "الرقمي", tone: "accent" },
      ],
    ],
    subtitle:
      "ثلاث خدمات واضحة: تصميم موقع إلكتروني، تصميم صفحة هبوط، وتحسين الظهور في محركات البحث",
    items: [
      {
        title: "تصميم موقع إلكتروني",
        description:
          "موقع يعرض نشاطك وخدماتك ويوجّه الزائر للتواصل أو الطلب بهوية واضحة وهيكل مرتب.",
        href: "/services/corporate-websites",
        linkLabel: "تفاصيل الخدمة",
        featured: false,
      },
      {
        title: "تصميم صفحة هبوط",
        description:
          "صفحة واحدة لحملتك أو عرضك: رسالة متطابقة مع الإعلان ومسار تحويل واحد.",
        href: "/services/landing-pages",
        linkLabel: "تفاصيل الخدمة",
        featured: true,
      },
      {
        title: "تحسين الظهور في محركات البحث",
        description:
          "ضبط العناوين والمحتوى وهيكل الصفحات والأداء ليظهر موقعك أوضح لمن يبحث عن خدماتك.",
        href: "/services/search-visibility",
        linkLabel: "تفاصيل الخدمة",
        featured: false,
      },
    ],
  },
  portfolio: {
    badge: "من أعمالي المنشورة",
    title: "مواقع لأنشطة مختلفة يمكن فتحها اليوم",
    titleLines: [
      [
        { text: "مواقع لقطاعات", tone: "light" },
        { text: "مختلفة", tone: "strong" },
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
      { text: "أصمّم وأطوّر المواقع في السعودية للشركات والمكاتب والعيادات والمطاعم وغيرها من الأنشطة. نفّذت " },
      { text: "أكثر من 30 مشروعاً", tone: "strong" },
      { text: "، منها مواقع لد. لطيفة الخرافي ومكتب المحامي ماجد الصقعبي ومطاعم الباب الشرقي. أركّز على " },
      { text: "محتوى واضح", tone: "strong" },
      { text: "، ومسار تواصل مفهوم، وهيكل صفحات يدعم الظهور في البحث — مع تسليم مرتّب واتفاق سعر عبر واتساب." },
    ],
  },
  process: {
    title: "كيف نعمل معاً",
    steps: [
      {
        lead: "تحديد",
        accent: "المتطلبات",
        description:
          "نحدّد هدف الموقع والزائر المطلوب: تعريف بالنشاط، طلب تواصل، حجز، أو تحويل من حملة إعلانية.",
      },
      {
        lead: "تصميم",
        accent: "الواجهات",
        description:
          "أصمّم الواجهات بهويتك وترتيب واضح للخدمات ومسارات التحويل، مع مراعاة الاستخدام اليومي للزائر.",
      },
      {
        lead: "تطوير",
        accent: "الموقع",
        description:
          "أبني الصفحات بعناوين ووصف منظم، وأداء مناسب، وروابط تواصل تعمل بسلاسة.",
      },
      {
        lead: "النشر",
        accent: "والدعم",
        description:
          "أنشر الموقع وأسلّمك الصلاحيات، وأبقى للدعم بعد الإطلاق حسب الاتفاق.",
      },
    ],
  },
  cta: {
    titleLines: [
      [
        { text: "هل تريد موقعاً", tone: "light" },
        { text: "يوضّح نشاطك", tone: "strong" },
      ],
      [
        { text: "ويسهّل", tone: "light" },
        { text: "طلب التواصل؟", tone: "accent" },
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
    title: "تصميم موقع إلكتروني، صفحة هبوط، وتحسين الظهور",
    subtitle:
      "ثلاث خدمات للأنشطة التجارية: موقع إلكتروني يعرّف بك، صفحة هبوط لحملاتك، وتحسين الظهور في محركات البحث — باتفاق نطاق وسعر عبر واتساب.",
  },
  stats: [
    { label: "مشروع تم تنفيذه", value: "+30" },
    { label: "سنوات خبرة", value: "+3" },
  ],
  title: "الخدمات",
  subtitle:
    "اختر ما يناسب مرحلتك الآن: بناء موقع جديد، إطلاق صفحة هبوط، أو تحسين ظهور موقعك الحالي في البحث.",
  items: [
    {
      title: "تصميم موقع إلكتروني",
      description:
        "موقع يعرض نشاطك وخدماتك ومسارات التواصل بوضوح وهوية متسقة.",
      href: "/services/corporate-websites",
    },
    {
      title: "تصميم صفحة هبوط",
      description:
        "صفحة واحدة لإعلانك أو عرضك: رسالة مركّزة وزر واحد نحو الطلب أو التواصل.",
      href: "/services/landing-pages",
    },
    {
      title: "تحسين الظهور في محركات البحث",
      description:
        "تحسين العناوين والمحتوى وهيكل الصفحات والأداء ليظهر موقعك أوضح في نتائج البحث.",
      href: "/services/search-visibility",
    },
  ],
} as const;

export const portfolioPage = {
  title: "نماذج من مواقع صمّمتها",
  subtitle:
    "من عيادة ومكتب محاماة إلى مطعم — أنشطة مختلفة، ومواقع منشورة يمكن فتحها ومراجعتها بنفسك.",
  filterAll: "الكل",
  categories: ["موقع الكتروني متكامل", "صفحة هبوط", "نظام مخصص"],
  empty: "لا توجد أعمال في هذا التصنيف بعد.",
} as const;

export const blogPage = {
  title: "مدونة تصميم المواقع وصفحات الهبوط",
  titleBefore: "مقالات",
  titleStrong: "عملية",
  titleAfter: "عن",
  titleAccent: "المواقع والظهور",
  subtitle:
    "مقالات عن تصميم المواقع في السعودية، صفحات الهبوط، تكلفة المشروع، وما يساعد على بناء حضور أوضح في البحث.",
  readMore: "اقرأ المقالة",
  postCtaTitle: "هل تخطط لموقع أو صفحة هبوط؟",
  postCtaBody:
    "صف نشاطك وهدفك عبر واتساب، ونتفق على النطاق والسعر قبل البدء.",
  postCtaWhatsapp: "اطلب تصميم موقعك",
  postCtaBack: "العودة للمدونة",
} as const;

export const common = {
  learnMore: "اقرأ التفاصيل",
  requestCta: "اطلب تصميم موقعك",
  backToHome: "العودة للرئيسية",
} as const;
