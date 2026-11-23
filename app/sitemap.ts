import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

function entry(
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency,
  lastModified?: Date,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    changeFrequency,
    priority,
    ...(lastModified ? { lastModified } : {}),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    entry("/", 1, "weekly"),
    entry("/services", 0.9, "monthly"),
    ...services.map((service) =>
      entry(`/services/${service.slug}`, 0.8, "monthly"),
    ),
    entry("/portfolio", 0.9, "monthly"),
    ...projects.map((project) =>
      entry(`/portfolio/${project.slug}`, 0.7, "monthly"),
    ),
    entry("/blog", 0.8, "weekly"),
    ...posts.map((post) => {
      const published = new Date(post.date);
      return entry(
        `/blog/${post.slug}`,
        0.6,
        "yearly",
        Number.isNaN(published.getTime()) ? undefined : published,
      );
    }),
  ];
}
