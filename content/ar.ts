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
    line1: "أصمّم مواقع",
    line2: { before: "تحوّل الزوار إلى", accent: "عملاء" },
    body: [
      { text: "أساعد " },
      { text: "الشركات وأصحاب المشاريع", tone: "strong" },
      { text: " على بناء حضور رقمي قوي بمواقع عصرية وسريعة، مصمّمة لتحقيق " },
      { text: "نتائج حقيقية", tone: "strong" },
      { text: "." },
    ],
    primaryCta: "شاهد أعمالي",
    primaryHref: "/portfolio",
    secondaryCta: "تعرّف على خدماتي",
    secondaryHref: "/services",
  },
  marquee: [
    "موقع واضح يحوّل الزيارة إلى طلب",
    "صفحة هبوط مخصّصة لكل حملة إعلانية",
    "تجربة سهلة على الجوال وسرعة تحميل عالية",
  ],
  features: {
    titleLines: [
      [
        { text: "تأكد أن", tone: "light" },
        { text: "موقعك عملي", tone: "strong" },
        { text: "ويجلب", tone: "accent" },
      ],
      [
        { text: "نتائج", tone: "accent" },
        { text: "وليس جميل المظهر فقط!", tone: "light" },
      ],
    ],
    subtitle: "ما الذي أقدمه لجعل موقعك فعّال يضمن نجاح مشروعك",
    items: [
      {
        title: "نظام مخصص للموقع",
        description:
          "أنشئ لك موقع الكتروني متكامل بالنظام الذي تريده لتحويل فكرتك إلى واقع ومع أفضل تجربة مستخدم.",
        featured: false,
      },
      {
        title: "صفحات هبوط",
        description:
          "صفحة واحدة، عرض واحد، وإجراء واضح — من نقرة الإعلان إلى طلب حقيقي.",
        href: "/services/landing-pages",
        linkLabel: "تفاصيل الخدمة",
        featured: true,
      },
      {
        title: "تصميم متناسق مع الهوية",
        description:
          "أقدم لك تصميم احترافي مخصص لموقعك متناسق مع الهوية التجارية بخارطة عملية تساعد العملاء على فهم القيمة المقدمة.",
        href: "/services",
        featured: false,
      },
    ],
  },
  portfolio: {
    badge: "قصص نجاح عملائي",
    title: "ليست مجرد صور بل نتائج حية بين يديك!",
    titleLines: [
      [
        { text: "ليست مجرد صور", tone: "light" },
        { text: "بل", tone: "strong" },
      ],
      [
        { text: "نتائج حية", tone: "strong" },
        { text: "بين يديك!", tone: "accent" },
      ],
    ],
    cta: "شاهد أعمالي",
    thumbAlt: "معاينة مشروع",
  },
  about: {
    greetingPrefix: "هلا، أنا",
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
      { text: "متخصص في تصميم وتطوير المواقع " },
      { text: "للشركات وأصحاب المشاريع", tone: "strong" },
      { text: "، مع تركيز على الوضوح والجاذبية وتحقيق الأهداف. نفّذت " },
      { text: "أكثر من 30 مشروعاً", tone: "strong" },
      { text: " في مختلف المجالات." },
    ],
  },
  process: {
    title: "مراحل العمل معي",
    steps: [
      {
        lead: "الدراسة",
        accent: "والتخطيط",
        description: "أقوم بدراسة تفاصيل المشروع والتخطيط للموقع.",
      },
      {
        lead: "تصميم",
        accent: "الواجهات",
        description: "تصميم واجهات مخصصة للموقع متناسق مع الهوية.",
      },
      {
        lead: "تطوير",
        accent: "الموقع",
        description: "بناء الموقع بشكل متجاوب مع الجوالات.",
      },
      {
        lead: "الاختبار",
        accent: "والنشر",
        description: "والآن أنت جاهز لبدء تحقيق الأهداف!",
      },
    ],
  },
  cta: {
    titleLines: [
      [
        { text: "استثمارك في", tone: "light" },
        { text: "موقعك", tone: "strong" },
        { text: "هو", tone: "light" },
      ],
      [
        { text: "مفتاح", tone: "light" },
        { text: "نجاحك الرقمي!", tone: "accent" },
      ],
    ],
    button: "اطلب تصميم موقعك",
  },
} as const;

export const footer = {
  credit: "مصمم ومطور الموقع:",
  copyright: "جميع الحقوق محفوظة",
  linksTitle: "روابط الموقع:",
  links: [
    { href: "/", label: "الرئيسية" },
    { href: "/services", label: "الخدمات" },
    { href: "/portfolio", label: "الأعمال" },
    { href: "/blog", label: "المدونة" },
  ],
  socialLabel: "حسابات التواصل",
} as const;

export const servicesPage = {
  hero: {
    title: "حلول تصميم تناسب احتياجك",
    subtitle:
      "كل خدمة مصمّمة لمساعدتك على جذب العملاء وبناء ثقة جمهورك من أول زيارة — مع تركيز على الأداء والتحويل وليس المظهر فقط.",
  },
  stats: [
    { label: "مشروع تم تنفيذه", value: "+30" },
    { label: "سنوات خبرة", value: "+3" },
  ],
  title: "خدماتي في تصميم المواقع",
  subtitle:
    "تصميم مواقع تعريفية، صفحات هبوط للحملات، وإعادة تصميم المواقع الحالية — بجوال واضح وسرعة وأساس يظهر في البحث.",
  items: [
    {
      title: "تصميم مواقع تعريفية",
      description:
        "موقع رسمي لشركتك: رسالة واضحة، صفحات خدمات، وأعمال حقيقية، ومسار تواصل سهل على الجوال.",
      href: "/services/corporate-websites",
    },
    {
      title: "صفحات هبوط",
      description:
        "من النقرة إلى الطلب: صفحة واحدة، عرض واحد، وإجراء واضح — بدل تشتيت الزائر في الصفحة الرئيسية.",
      href: "/services/landing-pages",
    },
    {
      title: "إعادة تصميم المواقع",
      description:
        "عندما يعطّل الموقع الحالي عملك: هوية قديمة، جوال ضعيف، أو هيكل مربك — نحدّث التجربة بخطة واضحة.",
      href: "/services/website-redesign",
    },
  ],
} as const;

export const portfolioPage = {
  title: "نماذج من مواقع صمّمتها",
  subtitle:
    "كل مشروع يجمع بين الجمال البصري والأداء — لأن الموقع الجيد لا يكتفي بأن يبدو رائعاً فحسب.",
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
    "مقالات عملية عن اختيار مصمم مواقع، التكلفة، صفحات الهبوط، وSEO — لأصحاب الشركات والمشاريع.",
  readMore: "اقرأ المقالة",
} as const;

export const common = {
  learnMore: "للمزيد من التفاصيل",
  requestCta: "اطلب تصميم موقعك",
  backToHome: "العودة للرئيسية",
} as const;
