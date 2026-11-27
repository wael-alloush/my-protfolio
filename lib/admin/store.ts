import {
  mapPost,
  mapProject,
  mapService,
  type Post,
  type Project,
  type Service,
} from "@/lib/content";
import { db, nowUtc } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export type PostInput = Pick<
  Post,
  | "slug"
  | "title"
  | "description"
  | "category"
  | "date"
  | "content"
  | "status"
  | "seoTitle"
  | "seoDescription"
>;

export type ServiceInput = Pick<
  Service,
  | "slug"
  | "title"
  | "description"
  | "cardTitle"
  | "cardDescription"
  | "intro"
  | "points"
  | "sections"
  | "sortOrder"
  | "status"
  | "seoTitle"
  | "seoDescription"
>;

export type ProjectInput = Pick<
  Project,
  | "slug"
  | "name"
  | "category"
  | "summary"
  | "image"
  | "url"
  | "points"
  | "sections"
  | "featured"
  | "sortOrder"
  | "status"
  | "seoTitle"
  | "seoDescription"
>;

/** الرابط مستخدم في عنصر آخر من النوع نفسه. */
export class SlugTakenError extends Error {}

type Table = "wa_posts" | "wa_services" | "wa_projects";

async function rows(sql: string, params: unknown[] = []) {
  const pool = await db();
  const [result] = await pool.query<RowDataPacket[]>(sql, params);
  return result;
}

async function write(table: Table, values: Record<string, unknown>, id: number | null) {
  const pool = await db();
  const row = { ...values, updated_at: nowUtc() };
  try {
    if (id === null) {
      await pool.query(`INSERT INTO ${table} SET ?`, [row]);
    } else {
      await pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [row, id]);
    }
  } catch (error) {
    if ((error as { code?: string }).code === "ER_DUP_ENTRY") throw new SlugTakenError();
    throw error;
  }
}

async function remove(table: Table, id: number) {
  const pool = await db();
  await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
}

export async function listPosts() {
  return (await rows("SELECT * FROM wa_posts ORDER BY published_on DESC, id DESC")).map(mapPost);
}

export async function findPost(id: number) {
  const [row] = await rows("SELECT * FROM wa_posts WHERE id = ?", [id]);
  return row ? mapPost(row) : null;
}

export function writePost(input: PostInput, id: number | null) {
  return write(
    "wa_posts",
    {
      slug: input.slug,
      title: input.title,
      description: input.description,
      category: input.category,
      content: input.content,
      published_on: input.date,
      status: input.status,
      seo_title: input.seoTitle,
      seo_description: input.seoDescription,
    },
    id,
  );
}

export function removePost(id: number) {
  return remove("wa_posts", id);
}

export async function listServices() {
  return (await rows("SELECT * FROM wa_services ORDER BY sort_order ASC, id ASC")).map(mapService);
}

export async function findService(id: number) {
  const [row] = await rows("SELECT * FROM wa_services WHERE id = ?", [id]);
  return row ? mapService(row) : null;
}

export function writeService(input: ServiceInput, id: number | null) {
  return write(
    "wa_services",
    {
      slug: input.slug,
      title: input.title,
      description: input.description,
      card_title: input.cardTitle,
      card_description: input.cardDescription,
      intro: input.intro,
      points: JSON.stringify(input.points),
      sections: JSON.stringify(input.sections),
      sort_order: input.sortOrder,
      status: input.status,
      seo_title: input.seoTitle,
      seo_description: input.seoDescription,
    },
    id,
  );
}

export function removeService(id: number) {
  return remove("wa_services", id);
}

export async function listProjects() {
  return (await rows("SELECT * FROM wa_projects ORDER BY sort_order ASC, id ASC")).map(mapProject);
}

export async function findProject(id: number) {
  const [row] = await rows("SELECT * FROM wa_projects WHERE id = ?", [id]);
  return row ? mapProject(row) : null;
}

export function writeProject(input: ProjectInput, id: number | null) {
  return write(
    "wa_projects",
    {
      slug: input.slug,
      name: input.name,
      category: input.category,
      summary: input.summary,
      image: input.image,
      url: input.url,
      points: JSON.stringify(input.points),
      sections: JSON.stringify(input.sections),
      featured: input.featured ? 1 : 0,
      sort_order: input.sortOrder,
      status: input.status,
      seo_title: input.seoTitle,
      seo_description: input.seoDescription,
    },
    id,
  );
}

export function removeProject(id: number) {
  return remove("wa_projects", id);
}

export type Counts = { published: number; draft: number };

async function count(table: Table): Promise<Counts> {
  const result = await rows(`SELECT status, COUNT(*) AS total FROM ${table} GROUP BY status`);
  const counts: Counts = { published: 0, draft: 0 };
  for (const row of result) {
    if (row.status === "draft") counts.draft = Number(row.total);
    else counts.published += Number(row.total);
  }
  return counts;
}

export async function contentCounts() {
  const [posts, services, projects] = await Promise.all([
    count("wa_posts"),
    count("wa_services"),
    count("wa_projects"),
  ]);
  return { posts, services, projects };
}
