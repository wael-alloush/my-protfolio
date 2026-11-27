export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  image: string;
  featured?: boolean;
  url?: string;
  points?: readonly string[];
};

export const projects: Project[] = [
  {
    slug: "dr-lateefa-alkharafi",
    name: "د. لطيفة الخرافي",
    category: "موقع الكتروني متكامل",
    summary:
      "موقع لعيادة تقويم أسنان في الكويت: خدمات ومؤهلات وحالات قبل وبعد، مع مسار حجز استشارة ونموذج تواصل.",
    image: "/projects/drlateefaalkharafi.png",
    url: "https://drlateefaalkharafi.com/",
    points: ["حجز استشارة", "نموذج تواصل", "تصميم متجاوب"],
    featured: true,
  },
  {
    slug: "majed-alsaqebi",
    name: "مكتب المحامي ماجد الصقعبي",
    category: "موقع الكتروني متكامل",
    summary:
      "موقع لمكتب محاماة في الرياض: خدمات قانونية، سيرة مهنية، وآراء عملاء، مع نموذج طلب استشارة ومسار تواصل واضح.",
    image: "/projects/alsaqebi.png",
    url: "https://alsaqebi.waelaloush.com/",
    points: ["طلب استشارة", "آراء العملاء", "صفحات خدمات قانونية"],
    featured: true,
  },
  {
    slug: "al-bab-al-sharqi",
    name: "مطاعم الباب الشرقي",
    category: "موقع الكتروني متكامل",
    summary:
      "موقع لمطعم في الرياض: قائمة رقمية بتصنيفات، حجز طاولة، ودعم العربية والإنجليزية مع عرض واضح للأطباق.",
    image: "/projects/al-bab-al-sharqi-home.png",
    url: "https://al-bab-al-sharqi.waelaloush.com/",
    points: ["قائمة رقمية", "حجز طاولة", "عربي وإنجليزي"],
    featured: true,
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(limit = 10) {
  return projects.filter((p) => p.featured).slice(0, limit);
}
