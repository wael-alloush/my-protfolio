"use client";

import { savePost } from "@/app/admin/actions";
import {
  Field,
  FormActions,
  inputClass,
  SeoPanel,
  SlugField,
  StatusField,
  TextField,
  toolButtonClass,
  useEditor,
} from "@/components/admin/fields";
import { ContentTips } from "@/components/admin/ContentTips";
import { Panel } from "@/components/admin/ui";
import { MdxContent } from "@/components/blog/MdxContent";
import { parseMarkdownHeadings } from "@/lib/admin/headings";
import { cn } from "@/lib/cn";
import type { Post } from "@/lib/content";
import { useRef, useState, type FormEvent } from "react";

const LIST = "/admin/posts";

/** أزرار تُدرج صيغة التنسيق التي يفهمها عارض المقالات. */
const tools = [
  { label: "عنوان H2", text: "## ", block: true },
  { label: "عنوان H3", text: "### ", block: true },
  { label: "قائمة نقطية", text: "- ", block: true },
  { label: "قائمة مرقمة", text: "1. ", block: true },
  { label: "رابط", text: "[نص الرابط](https://)", block: false },
  {
    label: "رابط خدمة",
    text: "[تصميم موقع إلكتروني](/services/corporate-websites)",
    block: false,
  },
  {
    label: "رابط أعمال",
    text: "[نماذج من أعمالي](/portfolio)",
    block: false,
  },
];

export function PostForm({
  post,
  categories,
  today,
}: {
  post: Post | null;
  /** التصنيفات المستخدمة سابقاً، كاقتراحات */
  categories: string[];
  /** تاريخ اليوم بصيغة YYYY-MM-DD للمقال الجديد */
  today: string;
}) {
  const editor = useEditor(savePost, LIST);
  const [values, setValues] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    description: post?.description ?? "",
    category: post?.category ?? "",
    date: post?.date ?? today,
    content: post?.content ?? "",
    status: post?.status ?? "published",
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
  });
  const [preview, setPreview] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);

  function set<K extends keyof typeof values>(key: K) {
    return (value: (typeof values)[K]) =>
      setValues((current) => ({ ...current, [key]: value }));
  }

  function insert(text: string, block: boolean) {
    const field = area.current;
    if (!field) return;
    const before = values.content.slice(0, field.selectionStart);
    const after = values.content.slice(field.selectionEnd);
    // العناوين والقوائم تبدأ فقرة جديدة يفصلها سطر فارغ عمّا قبلها.
    const gap = block && before.trim() && !before.endsWith("\n\n")
      ? before.endsWith("\n") ? "\n" : "\n\n"
      : "";
    const caret = before.length + gap.length + text.length;
    set("content")(`${before}${gap}${text}${after}`);
    editor.touch();
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(caret, caret);
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    editor.save(new FormData(event.currentTarget));
  }

  const errors = editor.fields;
  const headings = parseMarkdownHeadings(values.content);

  return (
    <form onSubmit={submit} onChange={editor.touch} className="space-y-6" noValidate>
      {post?.id ? <input type="hidden" name="id" value={post.id} /> : null}

      <ContentTips kind="post" />

      <Panel title="المقال">
        <div className="space-y-5">
          <TextField
            label="العنوان (H1)"
            name="title"
            value={values.title}
            onChange={set("title")}
            error={errors.title}
            best={70}
            hint="عنوان واحد واضح بلا تكرار كلمات مفصولة بـ |."
          />
          <SlugField
            section="blog"
            value={values.slug}
            onChange={set("slug")}
            error={errors.slug}
            published={post?.status === "published"}
          />
          <TextField
            label="الوصف المختصر"
            name="description"
            value={values.description}
            onChange={set("description")}
            error={errors.description}
            rows={3}
            best={160}
            hint="يظهر في بطاقة المدونة وتحت العنوان في صفحة المقال، ويُستخدم للبحث إن تركت وصف السيو فارغاً."
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="التصنيف" error={errors.category}>
              <input
                name="category"
                value={values.category}
                onChange={(event) => set("category")(event.target.value)}
                list="post-categories"
                className={cn(inputClass, errors.category && "border-brand-error")}
              />
              <datalist id="post-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </Field>
            <TextField
              label="تاريخ النشر"
              name="date"
              type="date"
              value={values.date}
              onChange={set("date")}
              error={errors.date}
            />
            <StatusField value={values.status} onChange={set("status")} />
          </div>
        </div>
      </Panel>

      <Panel
        title="المحتوى والعناوين الفرعية"
        description="H1 هو عنوان المقال أعلاه. أدرج عناوين H2 عبر الزر أو بكتابة ## ثم العنوان في سطر مستقل — ضرورية لهيكل السيو. H3 لتفاصيل داخل قسم. زر واتساب يُضاف تلقائياً أسفل المقال."
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {tools.map((tool) => (
            <button
              key={tool.label}
              type="button"
              disabled={preview}
              onClick={() => insert(tool.text, tool.block)}
              className={toolButtonClass}
            >
              {tool.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPreview((shown) => !shown)}
            aria-pressed={preview}
            className={cn(
              "ms-auto",
              toolButtonClass,
              preview && "border-brand-accent bg-brand-accent text-brand-dark hover:border-brand-accent hover:bg-brand-accent",
            )}
          >
            {preview ? "العودة للكتابة" : "معاينة"}
          </button>
        </div>

        {/* الحقل يبقى في الصفحة أثناء المعاينة حتى يُرسل مع النموذج */}
        <textarea
          ref={area}
          name="content"
          value={values.content}
          onChange={(event) => set("content")(event.target.value)}
          rows={22}
          aria-label="محتوى المقال"
          aria-invalid={errors.content ? true : undefined}
          className={cn(
            inputClass,
            "leading-8",
            errors.content && "border-brand-error",
            preview && "hidden",
          )}
        />
        {preview ? (
          <div className="min-h-64 rounded-brand-lg border border-brand-border bg-brand-background p-5 sm:p-8">
            <div className="mx-auto max-w-3xl">
              {values.content.trim() ? (
                <MdxContent content={values.content} />
              ) : (
                <p className="text-brand-muted">لا يوجد محتوى للمعاينة بعد.</p>
              )}
            </div>
          </div>
        ) : null}
        {errors.content ? (
          <p role="alert" className="mt-1.5 text-sm text-brand-error">
            {errors.content}
          </p>
        ) : (
          <p className="mt-2 text-xs leading-6 text-brand-muted">
            للجدول: كل صف في سطر، وافصل الخانات بـ | — الصف الأول للعناوين.
          </p>
        )}
      </Panel>

      <SeoPanel
        section="blog"
        slug={values.slug}
        title={values.title}
        description={values.description}
        seoTitle={values.seoTitle}
        seoDescription={values.seoDescription}
        onSeoTitle={set("seoTitle")}
        onSeoDescription={set("seoDescription")}
        errors={errors}
        headings={headings}
        headingsHint="لا توجد عناوين H2 بعد. استخدم زر «عنوان H2» أو اكتب ## عنوان القسم في سطر مستقل."
      />

      <FormActions
        pending={editor.pending}
        error={editor.error}
        hasFieldErrors={Object.keys(errors).length > 0}
        cancelHref={LIST}
      />
    </form>
  );
}
