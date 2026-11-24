"use client";

import { saveService } from "@/app/admin/actions";
import {
  FormActions,
  SeoPanel,
  SlugField,
  StatusField,
  TextField,
  useEditor,
} from "@/components/admin/fields";
import { Panel } from "@/components/admin/ui";
import type { Service } from "@/lib/content";
import { useState, type FormEvent } from "react";

const LIST = "/admin/services";

type SectionDraft = { key: number; title: string; body: string; bullets: string };

const smallButton =
  "h-8 rounded-pill border border-brand-border px-3 text-xs font-medium text-brand-cream transition duration-brand hover:border-brand-accent hover:text-brand-accent disabled:opacity-40";

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
    (service?.sections ?? []).map((section, index) => ({
      key: index,
      title: section.title,
      body: section.body ?? "",
      bullets: (section.bullets ?? []).join("\n"),
    })),
  );
  const [nextKey, setNextKey] = useState(sections.length);

  function set<K extends keyof typeof values>(key: K) {
    return (value: (typeof values)[K]) =>
      setValues((current) => ({ ...current, [key]: value }));
  }

  function editSection(key: number, patch: Partial<SectionDraft>) {
    setSections((current) =>
      current.map((section) => (section.key === key ? { ...section, ...patch } : section)),
    );
  }

  function addSection() {
    setSections((current) => [...current, { key: nextKey, title: "", body: "", bullets: "" }]);
    setNextKey(nextKey + 1);
    editor.touch();
  }

  function removeSection(key: number) {
    setSections((current) => current.filter((section) => section.key !== key));
    editor.touch();
  }

  function moveSection(index: number, step: -1 | 1) {
    setSections((current) => {
      const target = index + step;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    editor.touch();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.set(
      "sections",
      JSON.stringify(sections.map(({ title, body, bullets }) => ({ title, body, bullets }))),
    );
    editor.save(form);
  }

  const errors = editor.fields;

  return (
    <form onSubmit={submit} onChange={editor.touch} className="space-y-6" noValidate>
      {service?.id ? <input type="hidden" name="id" value={service.id} /> : null}

      <Panel title="الخدمة">
        <div className="space-y-5">
          <TextField
            label="اسم الخدمة"
            name="title"
            value={values.title}
            onChange={set("title")}
            error={errors.title}
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
            hint="يظهر تحت اسم الخدمة في صفحتها، ويُستخدم وصفاً في نتائج البحث ما لم تكتب وصف سيو مختلفاً."
          />
          <TextField
            label="المقدمة"
            name="intro"
            value={values.intro}
            onChange={set("intro")}
            error={errors.intro}
            rows={5}
            hint="فقرة تشرح الخدمة ولمن تناسب، تظهر قبل الأقسام."
          />
          <TextField
            label="المزايا المختصرة"
            name="points"
            value={values.points}
            onChange={set("points")}
            rows={4}
            hint="ميزة في كل سطر. تظهر كوسوم قصيرة أعلى صفحة الخدمة."
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

      <Panel
        title="أقسام الصفحة"
        description="كل قسم بطاقة في صفحة الخدمة: عنوان، ثم نص أو نقاط أو كلاهما."
      >
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.key}
              role="group"
              aria-label={`القسم ${index + 1}`}
              className="space-y-4 rounded-brand-sm border border-brand-border bg-brand-background p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-brand-accent">القسم {index + 1}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={smallButton}
                    disabled={index === 0}
                    onClick={() => moveSection(index, -1)}
                  >
                    للأعلى
                  </button>
                  <button
                    type="button"
                    className={smallButton}
                    disabled={index === sections.length - 1}
                    onClick={() => moveSection(index, 1)}
                  >
                    للأسفل
                  </button>
                  <button
                    type="button"
                    className="h-8 px-2 text-xs font-medium text-brand-error hover:underline"
                    onClick={() => removeSection(section.key)}
                  >
                    حذف القسم
                  </button>
                </div>
              </div>
              <TextField
                label="عنوان القسم"
                value={section.title}
                onChange={(title) => editSection(section.key, { title })}
              />
              <TextField
                label="النص"
                value={section.body}
                onChange={(body) => editSection(section.key, { body })}
                rows={3}
              />
              <TextField
                label="النقاط"
                value={section.bullets}
                onChange={(bullets) => editSection(section.key, { bullets })}
                rows={4}
                hint="نقطة في كل سطر."
              />
            </div>
          ))}

          {errors.sections ? (
            <p role="alert" className="text-sm text-brand-error">
              {errors.sections}
            </p>
          ) : null}

          <button type="button" className={smallButton} onClick={addSection}>
            + إضافة قسم
          </button>
        </div>
      </Panel>

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
          />
          <TextField
            label="وصف البطاقة"
            name="cardDescription"
            value={values.cardDescription}
            onChange={set("cardDescription")}
            error={errors.cardDescription}
            rows={3}
            placeholder={values.description}
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
