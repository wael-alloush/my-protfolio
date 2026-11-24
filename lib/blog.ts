import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTime: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} دقائق قراءة`;
}

/** YAML يقرأ التاريخ غير المقتبس ككائن Date؛ نعيده إلى YYYY-MM-DD. */
function isoDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? "").slice(0, 10);
}

function readPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: isoDate(data.date),
    category: String(data.category ?? "تصميم مواقع"),
    readingTime: readingTime(content),
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readPost(file.replace(/\.mdx$/, "")))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  // الروابط تأتي من المتصفح؛ نقبل الأسماء البسيطة فقط حتى لا يُقرأ ملف خارج المجلد.
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  return readPost(slug);
}
