"use client";

import { TextField, toolButtonClass } from "@/components/admin/fields";
import { Panel } from "@/components/admin/ui";
import { useState } from "react";

export type SectionDraft = { key: number; title: string; body: string; bullets: string };

export function sectionsFromSaved(
  sections: ReadonlyArray<{ title: string; body?: string; bullets?: readonly string[] }>,
): SectionDraft[] {
  return sections.map((section, index) => ({
    key: index,
    title: section.title,
    body: section.body ?? "",
    bullets: (section.bullets ?? []).join("\n"),
  }));
}

export function serializeSections(sections: SectionDraft[]) {
  return JSON.stringify(
    sections.map(({ title, body, bullets }) => ({ title, body, bullets })),
  );
}

/** محرّر أقسام الصفحة: كل عنوان قسم يصبح H2 في الموقع وللسيو. */
export function SectionsEditor({
  sections,
  onChange,
  error,
  emptyHint,
}: {
  sections: SectionDraft[];
  onChange: (sections: SectionDraft[]) => void;
  error?: string;
  emptyHint: string;
}) {
  const [nextKey, setNextKey] = useState(() => sections.length);

  function edit(key: number, patch: Partial<SectionDraft>) {
    onChange(sections.map((section) => (section.key === key ? { ...section, ...patch } : section)));
  }

  function add() {
    onChange([...sections, { key: nextKey, title: "", body: "", bullets: "" }]);
    setNextKey((key) => key + 1);
  }

  function remove(key: number) {
    onChange(sections.filter((section) => section.key !== key));
  }

  function move(index: number, step: -1 | 1) {
    const target = index + step;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <Panel
      title="العناوين الفرعية (H2)"
      description="كل قسم يظهر كعنوان H2 في الصفحة — مهم لهيكل السيو. اكتب عنواناً يجيب عن سؤال الزائر، ثم نصاً أو نقاطاً."
    >
      <div className="space-y-4">
        {sections.length === 0 ? (
          <p className="text-sm leading-7 text-brand-muted">{emptyHint}</p>
        ) : null}

        {sections.map((section, index) => (
          <div
            key={section.key}
            role="group"
            aria-label={`العنوان الفرعي ${index + 1}`}
            className="space-y-4 rounded-brand-sm border border-brand-border bg-brand-background p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-brand-cream">H2 · {index + 1}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={toolButtonClass}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  للأعلى
                </button>
                <button
                  type="button"
                  className={toolButtonClass}
                  disabled={index === sections.length - 1}
                  onClick={() => move(index, 1)}
                >
                  للأسفل
                </button>
                <button
                  type="button"
                  className="h-8 px-2 text-xs font-medium text-brand-error hover:underline"
                  onClick={() => remove(section.key)}
                >
                  حذف
                </button>
              </div>
            </div>
            <TextField
              label="عنوان H2"
              value={section.title}
              onChange={(title) => edit(section.key, { title })}
              hint="مثال: كيف يتم الحجز؟ أو ما الذي يشمله المشروع؟"
            />
            <TextField
              label="النص"
              value={section.body}
              onChange={(body) => edit(section.key, { body })}
              rows={3}
            />
            <TextField
              label="النقاط"
              value={section.bullets}
              onChange={(bullets) => edit(section.key, { bullets })}
              rows={4}
              hint="نقطة في كل سطر."
            />
          </div>
        ))}

        {error ? (
          <p role="alert" className="text-sm text-brand-error">
            {error}
          </p>
        ) : null}

        <button type="button" className={toolButtonClass} onClick={add}>
          + إضافة عنوان فرعي H2
        </button>
      </div>
    </Panel>
  );
}
