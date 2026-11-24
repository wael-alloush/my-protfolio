import type { Post } from "@/lib/content";

/** التصنيفات المستخدمة في المقالات الحالية، لاقتراحها عند الكتابة. */
export function postCategories(posts: Post[]) {
  return [...new Set(posts.map((post) => post.category))];
}

/** تاريخ اليوم بتوقيت السعودية بصيغة YYYY-MM-DD، بصرف النظر عن توقيت الخادم. */
export function todayInRiyadh() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh" }).format(new Date());
}
