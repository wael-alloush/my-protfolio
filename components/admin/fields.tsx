"use client";

import { Notice, Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import type { ContentHeading } from "@/lib/admin/headings";
import type { ActionResult } from "@/lib/admin/validate";
import { cn } from "@/lib/cn";
import type { Status } from "@/lib/content";
import { brandedTitle } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

export const inputClass =
  "w-full rounded-brand-sm border border-brand-border bg-brand-background px-3.5 py-2.5 text-brand-cream transition duration-brand [color-scheme:dark] placeholder:text-brand-muted/60 focus:border-brand-secondary focus:outline-none";

export const toolButtonClass =
  "h-9 rounded-pill border border-brand-border px-3 text-xs font-medium text-brand-cream transition duration-brand hover:border-brand-secondary hover:bg-brand-card/40 disabled:opacity-40";

/**
 * حالة الحفظ المشتركة بين نماذج اللوحة: يرسل النموذج، يعرض الأخطاء،
 * وينبّه قبل إغلاق الصفحة إذا كانت فيها تعديلات لم تُحفظ.
 */
export function useEditor(
  action: (form: FormData) => Promise<ActionResult>,
  listHref: string,
) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult>({});
  const dirty = useRef(false);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty.current) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  function save(form: FormData) {
    startTransition(async () => {
      let next: ActionResult;
      try {
        next = await action(form);
      } catch {
        // خطأ الشبكة لا يجب أن يستبدل النموذج بصفحة خطأ ويضيّع ما كُتب.
        next = { error: "تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم حاول مجدداً." };
      }
      if (next.ok) {
        dirty.current = false;
        router.push(`${listHref}?saved=1`);
        return;
      }
      setResult(next);
    });
  }

  return {
    pending,
    error: result.error,
    fields: result.fields ?? {},
    save,
    touch: () => {
      dirty.current = true;
    },
  };
}

export function Field({
  label,
  hint,
  error,
  count,
  children,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  /** عدد الأحرف الحالي والحد الموصى به */
  count?: { length: number; best: number };
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-brand-cream">{label}</span>
        {count ? (
          <span
            className={cn(
              "text-xs tabular-nums",
              count.length > count.best ? "text-brand-error" : "text-brand-muted",
            )}
            dir="ltr"
          >
            {count.length} / {count.best}
          </span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span role="alert" className="mt-1.5 block text-sm text-brand-error">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs leading-6 text-brand-muted">{hint}</span>
      ) : null}
    </label>
  );
}

type TextFieldProps = {
  label: string;
  /** بدون اسم لا يُرسل الحقل مع النموذج (يُجمع يدوياً قبل الإرسال) */
  name?: string;
  value: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
  error?: string;
  /** الطول الموصى به؛ يُعرض عدّاد بجانب العنوان */
  best?: number;
  /** عدد الأسطر؛ وجوده يحوّل الحقل إلى مساحة نص */
  rows?: number;
  type?: "text" | "url" | "date" | "number";
  ltr?: boolean;
  placeholder?: string;
  className?: string;
};

export function TextField({
  label,
  name,
  value,
  onChange,
  hint,
  error,
  best,
  rows,
  type = "text",
  ltr = false,
  placeholder,
  className,
}: TextFieldProps) {
  const shared = {
    name,
    value,
    placeholder,
    dir: ltr ? ("ltr" as const) : undefined,
    "aria-invalid": error ? true : undefined,
    className: cn(inputClass, error && "border-brand-error", className),
  };

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      count={best ? { length: value.length, best } : undefined}
    >
      {rows ? (
        <textarea
          {...shared}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          {...shared}
          type={type}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  );
}

/** يحوّل ما يُكتب إلى صيغة رابط صالحة: حروف إنجليزية صغيرة وأرقام وشرطات. */
function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-/, "");
}

export function SlugField({
  section,
  value,
  onChange,
  error,
  published,
}: {
  /** المسار الذي يسبق الرابط، مثل blog */
  section: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** العنصر منشور حالياً برابط محفوظ */
  published: boolean;
}) {
  return (
    <TextField
      label="الرابط (Slug)"
      name="slug"
      value={value}
      onChange={(next) => onChange(toSlug(next))}
      error={error}
      ltr
      placeholder="website-design-cost"
      hint={
        <>
          <span dir="ltr" className="block truncate text-brand-cream/80">
            {siteConfig.url}/{section}/{value || "…"}
          </span>
          {published
            ? "تغيير رابط صفحة منشورة يجعل الرابط القديم لا يعمل ويفقده ترتيبه في البحث."
            : "كلمات إنجليزية قصيرة تصف الموضوع، تفصل بينها شرطات."}
        </>
      }
    />
  );
}

export function StatusField({
  value,
  onChange,
}: {
  value: Status;
  onChange: (value: Status) => void;
}) {
  return (
    <Field
      label="الحالة"
      hint={
        value === "draft"
          ? "المسودة محفوظة في اللوحة ولا تظهر في الموقع ولا في السايت ماب."
          : "تظهر في الموقع والسايت ماب فور الحفظ."
      }
    >
      <select
        name="status"
        value={value}
        onChange={(event) => onChange(event.target.value === "draft" ? "draft" : "published")}
        className={inputClass}
      >
        <option value="published">منشور</option>
        <option value="draft">مسودة</option>
      </select>
    </Field>
  );
}

const BEST_TITLE = 60;
const BEST_DESCRIPTION = 160;

/** هيكل العناوين كما تقرأه محركات البحث: H1 ثم H2/H3. */
function HeadingOutline({
  h1,
  headings,
  emptyHint,
}: {
  h1: string;
  headings: ContentHeading[];
  emptyHint: string;
}) {
  const h2Count = headings.filter((heading) => heading.level === 2).length;

  return (
    <div className="rounded-brand-lg border border-brand-border bg-brand-background p-4">
      <p className="mb-2 text-meta text-brand-muted">هيكل العناوين (للسيو)</p>
      <ol className="space-y-1.5 text-sm leading-7">
        <li className="font-medium text-brand-cream">
          <span className="me-2 text-xs text-brand-muted">H1</span>
          {h1.trim() || "—"}
        </li>
        {headings.map((heading, index) => (
          <li
            key={`${heading.level}-${heading.text}-${index}`}
            className={cn(
              "text-brand-text-soft",
              heading.level === 3 && "ps-4",
            )}
          >
            <span className="me-2 text-xs text-brand-muted">H{heading.level}</span>
            {heading.text}
          </li>
        ))}
      </ol>
      {h2Count === 0 ? (
        <p className="mt-3 text-xs leading-6 text-brand-error">{emptyHint}</p>
      ) : (
        <p className="mt-3 text-xs leading-6 text-brand-muted">
          {h2Count} عنوان H2 — جيد لتقسيم الصفحة وفهم جوجل للمحتوى.
        </p>
      )}
    </div>
  );
}

/** عنوان ووصف نتيجة البحث، مع معاينة لشكلها في Google وهيكل العناوين. */
export function SeoPanel({
  section,
  slug,
  title,
  description,
  seoTitle,
  seoDescription,
  onSeoTitle,
  onSeoDescription,
  errors,
  headings = [],
  headingsHint,
}: {
  section: string;
  slug: string;
  /** العنوان والوصف الأساسيان؛ يُستخدمان عند ترك حقول السيو فارغة */
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  onSeoTitle: (value: string) => void;
  onSeoDescription: (value: string) => void;
  errors: Record<string, string>;
  /** عناوين H2/H3 المستخرجة من المحتوى أو الأقسام */
  headings?: ContentHeading[];
  /** يظهر عند غياب أي H2 */
  headingsHint: string;
}) {
  const shownTitle = brandedTitle(seoTitle.trim() || title.trim() || "عنوان الصفحة");
  const shownDescription =
    seoDescription.trim() || description.trim() || "وصف الصفحة كما يظهر تحت العنوان.";
  const host = siteConfig.url.replace(/^https?:\/\//, "");

  const stuffing =
    (seoTitle.trim() || title).includes("|") &&
    (seoTitle.trim() || title).split("|").length > 2;

  return (
    <Panel
      title="الظهور في محركات البحث"
      description="العنوان والوصف لنتيجة Google، مع هيكل العناوين الفرعية H2/H3 من المحتوى."
    >
      <div className="space-y-5">
        <div className="rounded-brand-lg border border-brand-border bg-brand-background p-4">
          <p className="mb-2 text-meta text-brand-muted">معاينة تقريبية في Google</p>
          <p dir="ltr" className="truncate text-end text-xs text-brand-muted">
            {host} › {section} › {slug || "…"}
          </p>
          <p className="mt-1 line-clamp-1 text-lg font-medium text-[#8ab4f8]">
            {shownTitle}
          </p>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-brand-text-soft">
            {shownDescription}
          </p>
        </div>

        <HeadingOutline
          h1={title}
          headings={headings}
          emptyHint={headingsHint}
        />

        {stuffing ? (
          <Notice tone="error">
            العنوان يبدو محشواً بكلمات مفصولة بـ |. اختصر إلى عنوان واحد واضح.
          </Notice>
        ) : null}

        <TextField
          label="عنوان السيو"
          name="seoTitle"
          value={seoTitle}
          onChange={onSeoTitle}
          error={errors.seoTitle}
          best={BEST_TITLE}
          placeholder={title}
          hint={`يُضاف «| ${siteConfig.name}» تلقائياً. الطول الكامل الآن ${shownTitle.length} حرفاً — الأفضل ≤ ${BEST_TITLE}.`}
        />
        <TextField
          label="وصف السيو"
          name="seoDescription"
          value={seoDescription}
          onChange={onSeoDescription}
          error={errors.seoDescription}
          best={BEST_DESCRIPTION}
          rows={3}
          placeholder={description}
          hint={`جملة تدفع للنقر وتمثّل الصفحة بصدق. الطول الآن ${shownDescription.length} — الأفضل 120–${BEST_DESCRIPTION}. لا تكتب «استشارة مجانية» إن لم تكن جزءاً من عرضك.`}
        />
      </div>
    </Panel>
  );
}

/** شريط الحفظ أسفل كل نموذج. */
export function FormActions({
  pending,
  error,
  hasFieldErrors,
  cancelHref,
}: {
  pending: boolean;
  error?: string;
  hasFieldErrors: boolean;
  cancelHref: string;
}) {
  return (
    <div className="sticky bottom-0 z-30 -mx-4 border-t border-brand-border bg-brand-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      {error ? (
        <div className="mb-3">
          <Notice tone="error">{error}</Notice>
        </div>
      ) : hasFieldErrors ? (
        <div className="mb-3">
          <Notice tone="error">لم يُحفظ. راجع الحقول المشار إليها بالأحمر.</Notice>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "جارٍ الحفظ…" : "حفظ"}
        </Button>
        <Button href={cancelHref} variant="ghost" size="sm">
          إلغاء
        </Button>
      </div>
    </div>
  );
}
