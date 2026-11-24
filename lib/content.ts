import { projects as fileProjects } from "@/content/projects";
import { services as fileServices, type ServiceSection } from "@/content/services";
import { getAllPosts as filePosts, readingTime } from "@/lib/blog";
import { db, isDbConfigured } from "@/lib/db";
import { serviceCard } from "@/lib/seed";
import type { RowDataPacket } from "mysql2/promise";
import { cache } from "react";

export type Status = "published" | "draft";

type Managed = {
  /** null عندما يأتي المحتوى من الملفات لا من قاعدة البيانات */
  id: number | null;
  status: Status;
  /** ISO 8601 بتوقيت UTC */
  updatedAt: string | null;
  /** فارغ = يُستخدم العنوان والوصف الأساسيان في نتائج البحث */
  seoTitle: string;
  seoDescription: string;
};

export type Post = Managed & {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** YYYY-MM-DD */
  date: string;
  content: string;
  readingTime: string;
};

export type Service = Managed & {
  slug: string;
  title: string;
  description: string;
  /** عنوان ووصف البطاقة في صفحة الخدمات؛ فارغ = العنوان والوصف الأساسيان */
  cardTitle: string;
  cardDescription: string;
  intro: string;
  points: string[];
  sections: ServiceSection[];
  sortOrder: number;
};

export type Project = Managed & {
  slug: string;
  name: string;
  category: string;
  summary: string;
  image: string;
  url: string;
  points: string[];
  featured: boolean;
  sortOrder: number;
};

function stringList(value: unknown): string[] {
  try {
    const parsed: unknown = JSON.parse(String(value ?? "[]"));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function sectionList(value: unknown): ServiceSection[] {
  try {
    const parsed: unknown = JSON.parse(String(value ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: Record<string, unknown>) => {
      const body = String(item.body ?? "").trim();
      const bullets = Array.isArray(item.bullets) ? item.bullets.map(String) : [];
      return {
        title: String(item.title ?? ""),
        ...(body ? { body } : {}),
        ...(bullets.length > 0 ? { bullets } : {}),
      };
    });
  } catch {
    return [];
  }
}

function utc(value: unknown) {
  const text = String(value ?? "");
  return text ? `${text.replace(" ", "T")}Z` : null;
}

function managed(row: RowDataPacket): Managed {
  return {
    id: Number(row.id),
    status: row.status === "draft" ? "draft" : "published",
    updatedAt: utc(row.updated_at),
    seoTitle: String(row.seo_title ?? ""),
    seoDescription: String(row.seo_description ?? ""),
  };
}

export function mapPost(row: RowDataPacket): Post {
  const content = String(row.content ?? "");
  return {
    ...managed(row),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    category: String(row.category),
    date: String(row.published_on).slice(0, 10),
    content,
    readingTime: readingTime(content),
  };
}

export function mapService(row: RowDataPacket): Service {
  return {
    ...managed(row),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    cardTitle: String(row.card_title ?? ""),
    cardDescription: String(row.card_description ?? ""),
    intro: String(row.intro),
    points: stringList(row.points),
    sections: sectionList(row.sections),
    sortOrder: Number(row.sort_order),
  };
}

export function mapProject(row: RowDataPacket): Project {
  return {
    ...managed(row),
    slug: String(row.slug),
    name: String(row.name),
    category: String(row.category),
    summary: String(row.summary),
    image: String(row.image),
    url: String(row.url ?? ""),
    points: stringList(row.points),
    featured: Number(row.featured) === 1,
    sortOrder: Number(row.sort_order),
  };
}

const fromFile: Managed = {
  id: null,
  status: "published",
  updatedAt: null,
  seoTitle: "",
  seoDescription: "",
};

function postsFromFiles(): Post[] {
  return filePosts().map((post) => ({ ...fromFile, ...post }));
}

function servicesFromFiles(): Service[] {
  return fileServices.map((service, index) => {
    const card = serviceCard(service.slug);
    return {
      ...fromFile,
      slug: service.slug,
      title: service.title,
      description: service.description,
      cardTitle: card.title,
      cardDescription: card.description,
      intro: service.intro,
      points: [...service.points],
      sections: [...service.sections],
      sortOrder: index + 1,
    };
  });
}

function projectsFromFiles(): Project[] {
  return fileProjects.map((project, index) => ({
    ...fromFile,
    slug: project.slug,
    name: project.name,
    category: project.category,
    summary: project.summary,
    image: project.image,
    url: project.url ?? "",
    points: [...(project.points ?? [])],
    featured: Boolean(project.featured),
    sortOrder: index + 1,
  }));
}

/**
 * بدون قاعدة بيانات يُقرأ المحتوى من الملفات. إذا تعذّر الاتصال أثناء البناء
 * تُستخدم الملفات أيضاً حتى لا يفشل النشر، أما أثناء التشغيل فيُرمى الخطأ
 * لتبقى آخر نسخة سليمة من الصفحة معروضة بدل استبدالها بمحتوى قديم.
 */
async function load<T>(query: () => Promise<T>, files: () => T): Promise<T> {
  if (!isDbConfigured()) return files();
  try {
    return await query();
  } catch (error) {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.warn(
        "Database unreachable during build; using content files.",
        error instanceof Error ? error.message : error,
      );
      return files();
    }
    throw error;
  }
}

export const getPosts = cache(() =>
  load(async () => {
    const pool = await db();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM wa_posts WHERE status = 'published' ORDER BY published_on DESC, id DESC",
    );
    return rows.map(mapPost);
  }, postsFromFiles),
);

export const getServices = cache(() =>
  load(async () => {
    const pool = await db();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM wa_services WHERE status = 'published' ORDER BY sort_order ASC, id ASC",
    );
    return rows.map(mapService);
  }, servicesFromFiles),
);

export const getProjects = cache(() =>
  load(async () => {
    const pool = await db();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM wa_projects WHERE status = 'published' ORDER BY sort_order ASC, id ASC",
    );
    return rows.map(mapProject);
  }, projectsFromFiles),
);

export async function getPost(slug: string) {
  return (await getPosts()).find((post) => post.slug === slug) ?? null;
}

export async function getService(slug: string) {
  return (await getServices()).find((service) => service.slug === slug) ?? null;
}

export async function getProject(slug: string) {
  return (await getProjects()).find((project) => project.slug === slug) ?? null;
}

export async function getFeaturedProjects(limit = 10) {
  return (await getProjects()).filter((project) => project.featured).slice(0, limit);
}
