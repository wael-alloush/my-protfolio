"use client";

import { saveService } from "@/app/admin/actions";
import { ContentTips } from "@/components/admin/ContentTips";
import {
  FormActions,
  SeoPanel,
  SlugField,
  StatusField,
  TextField,
  useEditor,
} from "@/components/admin/fields";
import {
  SectionsEditor,
  sectionsFromSaved,
  serializeSections,
  type SectionDraft,
} from "@/components/admin/SectionsEditor";
import { Panel } from "@/components/admin/ui";
import { headingsFromTitles } from "@/lib/admin/headings";
import type { Service } from "@/lib/content";
import { useState, type FormEvent } from "react";

const LIST = "/admin/services";

export function ServiceForm({
  service,
  nextOrder,
}: {
  service: Service | null;
  /** الترتيب المقترح لخدمة جديدة: بعد آخر خدمة */
  nextOrder: number;
}) {
  const editor = useEditor(saveService, LIST);
  const [values, setValues] = useState({
    title: service?.title ?? "",
    slug: service?.slug ?? "",
    description: service?.description ?? "",
    intro: service?.intro ?? "",
    points: service?.points.join("\n") ?? "",
    cardTitle: service?.cardTitle ?? "",
    cardDescription: service?.cardDescription ?? "",
    sortOrder: String(service?.sortOrder ?? nextOrder),
    status: service?.status ?? "published",
    seoTitle: service?.seoTitle ?? "",
    seoDescription: service?.seoDescription ?? "",
  });
  const [sections, setSections] = useState<SectionDraft[]>(() =>
    sectionsFromSaved(service?.sections ?? []),
  );

  function set<K extends keyof typeof values>(key: K) {
    return (value: (typeof values)[K]) =>
      setValues((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.set("sections", serializeSections(sections));
    editor.save(form);
  }

  const errors = editor.fields;
  const headings = headingsFromTitles(sections.map((section) => section.title));

  return (
    <form onSubmit={submit} onChange={editor.touch} className="space-y-6" noValidate>
      {service?.id ? <input type="hidden" name="id" value={service.id} /> : null}

      <ContentTips kind="service" />

      <Panel title="الخدمة">
        <div className="space-y-5">
          <TextField
            label="اسم الخدمة (H1)"
            name="title"
            value={values.title}
            onChange={set("title")}
            error={errors.title}
            best={70}
            hint="مثال: تصميم موقع إلكتروني — نية واضحة بلا حشو."
          />
          <SlugField
            section="services"
            value={values.slug}
            onChange={set("slug")}
            error={errors.slug}
            published={service?.status === "published"}
          />
          <TextField
            label="الوصف"
            name="description"
            value={values.description}
            onChange={set("description")}
            error={errors.description}
            rows={3}
            best={160}
            hint="يظهر تحت الاسم في PageHero ويُستخدم للبحث إن تركت وصف السيو فارغاً. ركّز على الحجز أو واتساب أو وضوح الجوال."
          />
          <TextField
            label="المقدمة"
            name="intro"
            value={values.intro}
            onChange={set("intro")}
            error={errors.intro}
            rows={5}
            hint="لمن الخدمة وكيف نعمل (متطلبات → واجهات → تطوير → نشر ودعم)."
          />
          <TextField
            label="المزايا المختصرة"
            name="points"
            value={values.points}
            onChange={set("points")}
            rows={4}
            hint="ميزة ملموسة في كل سطر (مثل مسار حجز أو واتساب)، تظهر كوسوم أعلى الصفحة."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="الترتيب"
              name="sortOrder"
              type="number"
              value={values.sortOrder}
              onChange={set("sortOrder")}
              error={errors.sortOrder}
              ltr
              hint="الرقم الأصغر يظهر أولاً في صفحة الخدمات."
            />
            <StatusField value={values.status} onChange={set("status")} />
          </div>
        </div>
      </Panel>

      <SectionsEditor
        sections={sections}
        onChange={(next) => {
          setSections(next);
          editor.touch();
        }}
        error={errors.sections}
        emptyHint="أضف عنوانين H2 على الأقل يشرحان النتيجة أو الأسئلة الشائعة حول الخدمة."
      />

      <Panel
        title="بطاقة الخدمة في صفحة الخدمات"
        description="عنوان ووصف أقصر للبطاقة. اتركهما فارغين ليُستخدم اسم الخدمة ووصفها."
      >
        <div className="space-y-5">
          <TextField
            label="عنوان البطاقة"
            name="cardTitle"
            value={values.cardTitle}
            onChange={set("cardTitle")}
            error={errors.cardTitle}
            placeholder={values.title}
            hint="أقصر من اسم الصفحة إن أمكن — يظهر في شبكة /services."
          />
          <TextField
            label="وصف البطاقة"
            name="cardDescription"
            value={values.cardDescription}
            onChange={set("cardDescription")}
            error={errors.cardDescription}
            rows={3}
            placeholder={values.description}
            hint="سطر أو سطران عن النتيجة للعميل، بلا تكرار كامل للوصف الطويل."
          />
        </div>
      </Panel>

      <SeoPanel
        section="services"
        slug={values.slug}
        title={values.title}
        description={values.description}
        seoTitle={values.seoTitle}
        seoDescription={values.seoDescription}
        onSeoTitle={set("seoTitle")}
        onSeoDescription={set("seoDescription")}
        errors={errors}
        headings={headings}
        headingsHint="لا توجد عناوين H2 بعد. أضفها من قسم «العناوين الفرعية» أعلاه."
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
