"use server";

import {
  endSession,
  isAdmin,
  isAdminConfigured,
  loginAllowed,
  passwordMatches,
  recordFailedLogin,
  startSession,
} from "@/lib/admin/auth";
import {
  findPost,
  findProject,
  findService,
  removePost,
  removeProject,
  removeService,
  SlugTakenError,
  writePost,
  writeProject,
  writeService,
} from "@/lib/admin/store";
import {
  parsePost,
  parseProject,
  parseService,
  type ActionResult,
  type FieldErrors,
} from "@/lib/admin/validate";
import { addMedia, detectImage, MAX_IMAGE_BYTES, removeMedia } from "@/lib/media";
import { recordRedirect } from "@/lib/redirects";
import { saveChannelSettings, type ChannelSettings } from "@/lib/settings";
import { defaultAds, defaultSocial, SOCIAL_LABELS, type SocialKey } from "@/lib/site";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SESSION_EXPIRED: ActionResult = {
  error: "انتهت جلسة الدخول. سجّل الدخول من جديد ثم أعد المحاولة.",
};

/** كل إجراء يتحقق من الجلسة بنفسه، لأن الإجراءات تُستدعى بطلب مباشر أيضاً. */
async function denied(): Promise<ActionResult | null> {
  return (await isAdmin()) ? null : SESSION_EXPIRED;
}

function itemId(form: FormData) {
  const value = Number(form.get("id"));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function failure(error: unknown): ActionResult {
  if (error instanceof SlugTakenError) {
    return { fields: { slug: "هذا الرابط مستخدم في عنصر آخر. اختر رابطاً مختلفاً." } };
  }
  console.error(error);
  if ((error as { code?: string }).code === "ER_NET_PACKET_TOO_LARGE") {
    return { fields: { image: "الصورة أكبر مما تقبله قاعدة البيانات. اختر صورة أصغر." } };
  }
  return { error: "تعذّر الحفظ. تحقق من اتصال قاعدة البيانات ثم حاول مجدداً." };
}

/** الصفحات العامة ثابتة؛ بعد كل تعديل تُجدَّد كلها ومعها السايت ماب وملفات الوكلاء. */
function publish() {
  revalidatePath("/", "layout");
  for (const path of ["/sitemap.xml", "/llms.txt", "/index.md"]) revalidatePath(path);
}

/** تحويل دائم لمسار كان منشوراً فقط؛ المسودات لم تُفهرَس فلا تحتاج تحويلاً. */
async function keepPath(
  section: "blog" | "services" | "portfolio",
  previous: { slug: string; status: string } | null | undefined,
  nextSlug: string | null,
  fallback: string,
) {
  if (!previous || previous.status !== "published") return;
  const from = `/${section}/${previous.slug}`;
  if (nextSlug && nextSlug !== previous.slug) {
    await recordRedirect(from, `/${section}/${nextSlug}`);
    return;
  }
  if (!nextSlug) await recordRedirect(from, fallback);
}

function parseChannels(form: FormData): { ok: true; value: ChannelSettings } | { ok: false; fields: FieldErrors } {
  const fields: FieldErrors = {};
  const phone = String(form.get("phone") ?? "").replace(/\D/g, "");
  const email = String(form.get("email") ?? "").trim();

  if (!phone || phone.length < 8) fields.phone = "أدخل رقم جوال دولي صحيحاً (8 أرقام على الأقل).";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fields.email = "أدخل بريداً إلكترونياً صحيحاً أو اتركه فارغاً.";
  }

  const social = { ...defaultSocial };
  for (const key of Object.keys(SOCIAL_LABELS) as SocialKey[]) {
    const value = String(form.get(`social_${key}`) ?? "").trim();
    if (value && !/^https?:\/\//i.test(value)) {
      fields[`social_${key}`] = "ابدأ الرابط بـ https:// أو امسحه للحذف.";
    } else {
      social[key] = value;
    }
  }

  const ads = { ...defaultAds };
  for (const key of Object.keys(defaultAds) as (keyof typeof defaultAds)[]) {
    ads[key] = String(form.get(`ads_${key}`) ?? "").trim();
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return { ok: true, value: { phone, email, social, ads } };
}

export async function saveChannels(form: FormData): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  const parsed = parseChannels(form);
  if (!parsed.ok) return { fields: parsed.fields };

  try {
    await saveChannelSettings(parsed.value);
  } catch (error) {
    return failure(error);
  }
  publish();
  return { ok: true };
}

export async function login(_previous: ActionResult, form: FormData): Promise<ActionResult> {
  if (!isAdminConfigured()) {
    return { error: "لم تُضبط كلمة مرور اللوحة بعد." };
  }
  if (!(await loginAllowed())) {
    return { error: "محاولات كثيرة. انتظر عشر دقائق ثم حاول من جديد." };
  }
  if (!passwordMatches(String(form.get("password") ?? ""))) {
    await recordFailedLogin();
    return { error: "كلمة المرور غير صحيحة." };
  }

  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function savePost(form: FormData): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  const id = itemId(form);
  const parsed = parsePost(form);
  if (!parsed.ok) return { fields: parsed.errors };

  try {
    const existing = id === null ? null : await findPost(id);
    if (id !== null && !existing) return { error: "هذه المقالة لم تعد موجودة." };
    await writePost(parsed.value, id);
    await keepPath("blog", existing, parsed.value.slug, "/blog");
  } catch (error) {
    return failure(error);
  }
  publish();
  return { ok: true };
}

export async function deletePost(id: number): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  try {
    const existing = await findPost(id);
    await removePost(id);
    await keepPath("blog", existing, null, "/blog");
  } catch (error) {
    return failure(error);
  }
  publish();
  return { ok: true };
}

export async function saveService(form: FormData): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  const id = itemId(form);
  const parsed = parseService(form);
  if (!parsed.ok) return { fields: parsed.errors };

  try {
    const existing = id === null ? null : await findService(id);
    if (id !== null && !existing) return { error: "هذه الخدمة لم تعد موجودة." };
    await writeService(parsed.value, id);
    await keepPath("services", existing, parsed.value.slug, "/services");
  } catch (error) {
    return failure(error);
  }
  publish();
  return { ok: true };
}

export async function deleteService(id: number): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  try {
    const existing = await findService(id);
    await removeService(id);
    await keepPath("services", existing, null, "/services");
  } catch (error) {
    return failure(error);
  }
  publish();
  return { ok: true };
}

export async function saveProject(form: FormData): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  const id = itemId(form);
  const parsed = parseProject(form);
  const fields: FieldErrors = parsed.ok ? {} : { ...parsed.errors };

  try {
    // الصورة السابقة تُقرأ من قاعدة البيانات، لا من النموذج.
    const existing = id === null ? null : await findProject(id);
    if (id !== null && !existing) return { error: "هذا المشروع لم يعد موجوداً." };
    const previous = existing?.image ?? "";

    const file = form.get("imageFile");
    let upload: { kind: NonNullable<ReturnType<typeof detectImage>>; data: Buffer } | null = null;
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_IMAGE_BYTES) {
        fields.image = "الصورة أكبر من الحد المسموح. اختر صورة أصغر.";
      } else {
        const data = Buffer.from(await file.arrayBuffer());
        const kind = detectImage(data);
        if (kind) upload = { kind, data };
        else fields.image = "استخدم صورة بصيغة PNG أو JPG أو WebP.";
      }
    } else if (!previous) {
      fields.image = "أضف صورة للمشروع.";
    }

    if (!parsed.ok || Object.keys(fields).length > 0) return { fields };

    const image = upload
      ? await addMedia(parsed.value.slug, upload.kind, upload.data)
      : previous;
    try {
      await writeProject({ ...parsed.value, image }, id);
    } catch (error) {
      if (upload) await removeMedia(image);
      throw error;
    }
    if (upload) await removeMedia(previous);
    await keepPath("portfolio", existing, parsed.value.slug, "/portfolio");
  } catch (error) {
    return failure(error);
  }
  publish();
  return { ok: true };
}

export async function deleteProject(id: number): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  try {
    const project = await findProject(id);
    await removeProject(id);
    if (project) await removeMedia(project.image);
    await keepPath("portfolio", project, null, "/portfolio");
  } catch (error) {
    return failure(error);
  }
  publish();
  return { ok: true };
}
