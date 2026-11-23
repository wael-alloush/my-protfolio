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
      "موقع عيادة تقويم أسنان في الكويت — يعرض الخدمات، المؤهلات، حالات قبل وبعد، وفيديوهات توعوية مع حجز استشارة مباشر.",
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
      "موقع مكتب محاماة في الرياض — يعرض الخدمات القانونية، السيرة الذاتية، آراء العملاء، ونموذج حجز استشارة، لقاضي محاكم الاستئناف سابقاً ومحامٍ وموثّق معتمد.",
    image: "/projects/alsaqebi.png",
    url: "https://alsaqebi.waelaloush.com/",
    points: ["حجز استشارة", "آراء العملاء", "تصميم احترافي"],
    featured: true,
  },
  {
    slug: "al-bab-al-sharqi",
    name: "مطاعم الباب الشرقي",
    category: "موقع الكتروني متكامل",
    summary:
      "موقع مطعم في الرياض — قائمة طعام رقمية بتصنيفات متعددة، حجز طاولة، ودعم العربية والإنجليزية، مع عرض أطباق شرقية أصيلة.",
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
