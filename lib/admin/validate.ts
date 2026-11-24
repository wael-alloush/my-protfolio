import { portfolioPage } from "@/content/ar";
import type { ServiceSection } from "@/content/services";
import type { PostInput, ProjectInput, ServiceInput } from "@/lib/admin/store";
import type { Status } from "@/lib/content";

export type FieldErrors = Record<string, string>;

/** ما يعيده كل إجراء في اللوحة إلى النموذج الذي استدعاه. */
export type ActionResult = { ok?: true; error?: string; fields?: FieldErrors };

type Parsed<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REQUIRED = "هذا الحقل مطلوب";

function text(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim() : "";
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** يقرأ الحقول ويجمع أخطاءها بدل التوقف عند أول خطأ. */
class Reader {
  readonly errors: FieldErrors = {};

  constructor(private readonly form: FormData) {}

  required(name: string, max: number) {
    const value = text(this.form, name);
    if (!value) this.errors[name] = REQUIRED;
    else if (value.length > max) this.errors[name] = `الحد الأقصى ${max} حرفاً`;
    return value;
  }

  optional(name: string, max: number) {
    const value = text(this.form, name);
    if (value.length > max) this.errors[name] = `الحد الأقصى ${max} حرفاً`;
    return value;
  }

  slug() {
    const value = text(this.form, "slug");
    if (!value) this.errors.slug = REQUIRED;
    else if (!SLUG.test(value) || value.length > 120) {
      this.errors.slug =
        "استخدم حروفاً إنجليزية صغيرة وأرقاماً وشرطات فقط، مثل website-design-cost";
    }
    return value;
  }

  status(): Status {
    return text(this.form, "status") === "draft" ? "draft" : "published";
  }

  sortOrder() {
    const value = Number(text(this.form, "sortOrder") || 0);
    if (!Number.isInteger(value) || value < 0 || value > 9999) {
      this.errors.sortOrder = "أدخل رقماً صحيحاً بين 0 و9999";
      return 0;
    }
    return value;
  }

  list(name: string) {
    return lines(text(this.form, name));
  }

  seo() {
    return {
      seoTitle: this.optional("seoTitle", 200),
      seoDescription: this.optional("seoDescription", 400),
    };
  }

  result<T>(value: T): Parsed<T> {
    return Object.keys(this.errors).length > 0
      ? { ok: false, errors: this.errors }
      : { ok: true, value };
  }
}

export function parsePost(form: FormData): Parsed<PostInput> {
  const read = new Reader(form);

  const date = text(form, "date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    read.errors.date = "اختر تاريخاً صحيحاً";
  }

  return read.result({
    title: read.required("title", 200),
    slug: read.slug(),
    description: read.required("description", 400),
    category: read.required("category", 100),
    date,
    content: read.required("content", 200_000),
    status: read.status(),
    ...read.seo(),
  });
}

function parseSections(form: FormData, errors: FieldErrors): ServiceSection[] {
  let raw: unknown;
  try {
    raw = JSON.parse(text(form, "sections") || "[]");
  } catch {
    raw = null;
  }
  if (!Array.isArray(raw)) {
    errors.sections = "تعذّرت قراءة الأقسام";
    return [];
  }

  const sections: ServiceSection[] = [];
  for (const item of raw as Record<string, unknown>[]) {
    const title = String(item?.title ?? "").trim();
    const body = String(item?.body ?? "").trim();
    const bullets = lines(String(item?.bullets ?? ""));
    if (!title && !body && bullets.length === 0) continue;
    if (!title || (!body && bullets.length === 0)) {
      errors.sections = "كل قسم يحتاج عنواناً، ومعه نص أو نقاط";
    }
    sections.push({
      title,
      ...(body ? { body } : {}),
      ...(bullets.length > 0 ? { bullets } : {}),
    });
  }
  return sections;
}

export function parseService(form: FormData): Parsed<ServiceInput> {
  const read = new Reader(form);

  return read.result({
    title: read.required("title", 200),
    slug: read.slug(),
    description: read.required("description", 400),
    cardTitle: read.optional("cardTitle", 200),
    cardDescription: read.optional("cardDescription", 400),
    intro: read.required("intro", 2000),
    points: read.list("points"),
    sections: parseSections(form, read.errors),
    sortOrder: read.sortOrder(),
    status: read.status(),
    ...read.seo(),
  });
}

/** الصورة تُحدَّد في الإجراء: ملف مرفوع جديد أو الصورة المحفوظة سابقاً. */
export function parseProject(form: FormData): Parsed<Omit<ProjectInput, "image">> {
  const read = new Reader(form);

  const category = text(form, "category");
  if (!(portfolioPage.categories as readonly string[]).includes(category)) {
    read.errors.category = "اختر تصنيفاً";
  }

  const url = text(form, "url");
  if (url && !/^https?:\/\/[^\s]+$/i.test(url)) {
    read.errors.url = "اكتب الرابط كاملاً، مثل https://example.com";
  } else if (url.length > 500) {
    read.errors.url = "الرابط طويل جداً";
  }

  return read.result({
    name: read.required("name", 200),
    slug: read.slug(),
    category,
    summary: read.required("summary", 600),
    url,
    points: read.list("points"),
    featured: text(form, "featured") === "1",
    sortOrder: read.sortOrder(),
    status: read.status(),
    ...read.seo(),
  });
}
