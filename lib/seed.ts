import { servicesPage } from "@/content/ar";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { getAllPosts } from "@/lib/blog";
import type { PoolConnection } from "mysql2/promise";

/** بطاقة الخدمة في صفحة الخدمات لها عنوان ووصف أقصر من صفحة الخدمة نفسها. */
export function serviceCard(slug: string) {
  const card = servicesPage.items.find(
    (item) => item.href === `/services/${slug}`,
  );
  return { title: card?.title ?? "", description: card?.description ?? "" };
}

/** ينقل المقالات والخدمات والمشاريع الموجودة في الملفات إلى قاعدة البيانات. */
export async function seedContent(connection: PoolConnection, now: string) {
  for (const post of getAllPosts()) {
    await connection.query(
      `INSERT IGNORE INTO wa_posts
        (slug, title, description, category, content, published_on, status, seo_title, seo_description, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'published', '', '', ?)`,
      [
        post.slug,
        post.title,
        post.description,
        post.category,
        post.content.trim(),
        post.date,
        `${post.date} 00:00:00`,
      ],
    );
  }

  for (const [index, service] of services.entries()) {
    const card = serviceCard(service.slug);
    await connection.query(
      `INSERT IGNORE INTO wa_services
        (slug, title, description, card_title, card_description, intro, points, sections, sort_order, status, seo_title, seo_description, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', '', '', ?)`,
      [
        service.slug,
        service.title,
        service.description,
        card.title,
        card.description,
        service.intro,
        JSON.stringify(service.points),
        JSON.stringify(service.sections),
        index + 1,
        now,
      ],
    );
  }

  for (const [index, project] of projects.entries()) {
    await connection.query(
      `INSERT IGNORE INTO wa_projects
        (slug, name, category, summary, image, url, points, sections, featured, sort_order, status, seo_title, seo_description, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', '', '', ?)`,
      [
        project.slug,
        project.name,
        project.category,
        project.summary,
        project.image,
        project.url ?? "",
        JSON.stringify(project.points ?? []),
        "[]",
        project.featured ? 1 : 0,
        index + 1,
        now,
      ],
    );
  }
}
