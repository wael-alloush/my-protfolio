"use client";

import { saveProject } from "@/app/admin/actions";
import {
  Field,
  FormActions,
  inputClass,
  SeoPanel,
  SlugField,
  StatusField,
  TextField,
  useEditor,
} from "@/components/admin/fields";
import { Panel } from "@/components/admin/ui";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/content";
import Image from "next/image";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

const LIST = "/admin/projects";

/** أقل من حد الخادم (900KB) بهامش؛ الصورة تُخزَّن في قاعدة البيانات. */
const TARGET_BYTES = 800_000;
const MAX_SIDE = 1600;

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

/** يصغّر الصورة ويحوّلها إلى WebP حتى تُحمَّل بسرعة في الموقع. */
async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file);
  let scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  let quality = 0.85;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const webp = await toBlob(canvas, "image/webp", quality);
    // المتصفح الذي لا يدعم WebP يعيد PNG، فيُستخدم JPEG بدلاً منه.
    const blob = webp?.type === "image/webp" ? webp : await toBlob(canvas, "image/jpeg", quality);
    if (blob && blob.size <= TARGET_BYTES) return blob;

    quality -= 0.1;
    scale *= 0.85;
  }
  return null;
}

export function ProjectForm({
  project,
  categories,
  nextOrder,
}: {
  project: Project | null;
  categories: readonly string[];
  /** الترتيب المقترح لمشروع جديد: بعد آخر مشروع */
  nextOrder: number;
}) {
  const editor = useEditor(saveProject, LIST);
  const [values, setValues] = useState({
    name: project?.name ?? "",
    slug: project?.slug ?? "",
    category: project?.category ?? categories[0] ?? "",
    summary: project?.summary ?? "",
    url: project?.url ?? "",
    points: project?.points.join("\n") ?? "",
    featured: project?.featured ?? true,
    sortOrder: String(project?.sortOrder ?? nextOrder),
    status: project?.status ?? "published",
    seoTitle: project?.seoTitle ?? "",
    seoDescription: project?.seoDescription ?? "",
  });
  const [upload, setUpload] = useState<{ blob: Blob; url: string } | null>(null);
  const [imageError, setImageError] = useState("");
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    return () => {
      if (upload) URL.revokeObjectURL(upload.url);
    };
  }, [upload]);

  function set<K extends keyof typeof values>(key: K) {
    return (value: (typeof values)[K]) =>
      setValues((current) => ({ ...current, [key]: value }));
  }

  async function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageError("");
    setPreparing(true);
    try {
      const blob = await compressImage(file);
      if (blob) setUpload({ blob, url: URL.createObjectURL(blob) });
      else setImageError("تعذّر تصغير الصورة إلى الحجم المطلوب. جرّب صورة أخرى.");
    } catch {
      setImageError("تعذّرت قراءة الملف. استخدم صورة بصيغة PNG أو JPG أو WebP.");
    } finally {
      setPreparing(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (upload) form.set("imageFile", upload.blob, "image");
    editor.save(form);
  }

  const errors = editor.fields;
  const shownImage = upload?.url ?? project?.image ?? "";
  const shownImageError = imageError || errors.image;

  return (
    <form onSubmit={submit} onChange={editor.touch} className="space-y-6" noValidate>
      {project?.id ? <input type="hidden" name="id" value={project.id} /> : null}

      <Panel title="المشروع">
        <div className="space-y-5">
          <TextField
            label="اسم المشروع"
            name="name"
            value={values.name}
            onChange={set("name")}
            error={errors.name}
          />
          <SlugField
            section="portfolio"
            value={values.slug}
            onChange={set("slug")}
            error={errors.slug}
            published={project?.status === "published"}
          />
          <TextField
            label="نبذة عن المشروع"
            name="summary"
            value={values.summary}
            onChange={set("summary")}
            error={errors.summary}
            rows={4}
            best={160}
            hint="تظهر في صفحة المشروع، وتُستخدم وصفاً في نتائج البحث ما لم تكتب وصف سيو مختلفاً."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="التصنيف" error={errors.category}>
              <select
                name="category"
                value={values.category}
                onChange={(event) => set("category")(event.target.value)}
                className={cn(inputClass, errors.category && "border-brand-error")}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>
            <TextField
              label="رابط الموقع المنفّذ"
              name="url"
              type="url"
              value={values.url}
              onChange={set("url")}
              error={errors.url}
              ltr
              placeholder="https://example.com"
              hint="اختياري. يظهر كزر «زيارة الموقع»."
            />
          </div>
          <TextField
            label="المزايا المختصرة"
            name="points"
            value={values.points}
            onChange={set("points")}
            rows={3}
            hint="ميزة في كل سطر. تظهر كوسوم قصيرة في صفحة المشروع."
          />
        </div>
      </Panel>

      <Panel
        title="صورة المشروع"
        description="لقطة لواجهة الموقع بنسبة 4:3 تقريباً. تُصغَّر وتُحوَّل إلى WebP تلقائياً قبل الرفع."
      >
        <div className="flex flex-wrap items-start gap-5">
          <div className="relative aspect-4/3 w-full max-w-xs overflow-hidden rounded-brand-sm border border-brand-border bg-brand-background">
            {shownImage ? (
              <Image
                src={shownImage}
                alt="صورة المشروع الحالية"
                fill
                unoptimized
                sizes="320px"
                className="object-cover object-top"
              />
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-brand-muted">
                لا توجد صورة بعد
              </p>
            )}
          </div>
          <div className="min-w-0 flex-1 basis-60">
            <Field
              label={shownImage ? "استبدال الصورة" : "اختر صورة"}
              error={shownImageError}
              hint={
                preparing
                  ? "جارٍ تجهيز الصورة…"
                  : upload
                    ? `جاهزة للرفع (${Math.round(upload.blob.size / 1024)} كيلوبايت). تُحفظ عند الضغط على «حفظ».`
                    : "PNG أو JPG أو WebP."
              }
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={chooseImage}
                className="block w-full text-sm text-brand-muted file:me-3 file:h-9 file:cursor-pointer file:rounded-pill file:border file:border-solid file:border-brand-border file:bg-brand-card file:px-4 file:text-sm file:font-medium file:text-brand-cream"
              />
            </Field>
          </div>
        </div>
      </Panel>

      <Panel title="العرض في الموقع">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="الترتيب"
            name="sortOrder"
            type="number"
            value={values.sortOrder}
            onChange={set("sortOrder")}
            error={errors.sortOrder}
            ltr
            hint="الرقم الأصغر يظهر أولاً في صفحة الأعمال."
          />
          <StatusField value={values.status} onChange={set("status")} />
          <label className="flex items-start gap-3 sm:col-span-2">
            <input
              type="checkbox"
              name="featured"
              value="1"
              checked={values.featured}
              onChange={(event) => set("featured")(event.target.checked)}
              className="mt-1.5 h-4 w-4 accent-brand-accent"
            />
            <span>
              <span className="block text-sm font-medium text-brand-cream">
                عرضه في شريط الأعمال بالصفحة الرئيسية
              </span>
              <span className="block text-xs leading-6 text-brand-muted">
                بدون هذا الخيار يظهر المشروع في صفحة الأعمال فقط.
              </span>
            </span>
          </label>
        </div>
      </Panel>

      <SeoPanel
        section="portfolio"
        slug={values.slug}
        title={values.name}
        description={values.summary}
        seoTitle={values.seoTitle}
        seoDescription={values.seoDescription}
        onSeoTitle={set("seoTitle")}
        onSeoDescription={set("seoDescription")}
        errors={errors}
      />

      <FormActions
        pending={editor.pending || preparing}
        error={editor.error}
        hasFieldErrors={Object.keys(errors).length > 0}
        cancelHref={LIST}
      />
    </form>
  );
}
