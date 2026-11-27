import { getPosts, getProjects, getServices } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";
import { connection } from "next/server";

/**
 * تُبنى الخريطة من المحتوى المنشور في القاعدة في كل طلب،
 * حتى يظهر أي نشر/تعديل/حذف من لوحة التحكم فوراً دون انتظار ISR.
 */
export const dynamic = "force-dynamic";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

function entry(
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency,
  modified?: string | null,
): MetadataRoute.Sitemap[number] {
  const lastModified = modified ? new Date(modified) : null;
  return {
    url: absoluteUrl(path),
    changeFrequency,
    priority,
    ...(lastModified && !Number.isNaN(lastModified.getTime())
      ? { lastModified }
      : {}),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // يضمن أن المسار ديناميكي في وقت التشغيل (Next 16).
  await connection();

  // getPosts / getServices / getProjects تُرجع المنشور فقط — المسودات لا تدخل الخريطة.
  const [services, projects, posts] = await Promise.all([
    getServices(),
    getProjects(),
    getPosts(),
  ]);

  return [
    entry("/", 1, "weekly"),
    entry("/about", 0.6, "yearly"),
    entry("/contact", 0.6, "yearly"),
    entry("/terms", 0.3, "yearly"),
    entry("/services", 0.9, "monthly"),
    ...services.map((service) =>
      entry(`/services/${service.slug}`, 0.8, "monthly", service.updatedAt),
    ),
    entry("/portfolio", 0.9, "monthly"),
    ...projects.map((project) =>
      entry(`/portfolio/${project.slug}`, 0.7, "monthly", project.updatedAt),
    ),
    entry("/blog", 0.8, "weekly"),
    ...posts.map((post) =>
      entry(`/blog/${post.slug}`, 0.6, "weekly", post.updatedAt ?? post.date),
    ),
  ];
}
