"use client";

import { Field, TextField, inputClass, useEditor } from "@/components/admin/fields";
import { Notice, Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/lib/admin/validate";
import type { ChannelSettings } from "@/lib/settings";
import { SOCIAL_LABELS, type AdsConfig, type SocialKey } from "@/lib/site";
import { useState } from "react";

const SOCIAL_KEYS = Object.keys(SOCIAL_LABELS) as SocialKey[];

const AD_FIELDS: {
  key: keyof AdsConfig;
  label: string;
  hint: string;
  placeholder: string;
}[] = [
  {
    key: "gtmId",
    label: "Google Tag Manager",
    hint: "معرّف الحاوية، مثل GTM-XXXXXXX. يكفي لإدارة معظم البكسلات من واجهة GTM.",
    placeholder: "GTM-XXXXXXX",
  },
  {
    key: "googleAdsId",
    label: "Google Ads",
    hint: "معرّف التحويل أو العلامة، مثل AW-123456789.",
    placeholder: "AW-123456789",
  },
  {
    key: "metaPixelId",
    label: "Meta Pixel",
    hint: "بكسل فيسبوك / إنستغرام للحملات.",
    placeholder: "123456789012345",
  },
  {
    key: "tiktokPixelId",
    label: "TikTok Pixel",
    hint: "معرّف بكسل تيك توك.",
    placeholder: "CXXXXXXXXXXXXXXXXXX",
  },
  {
    key: "snapchatPixelId",
    label: "Snapchat Pixel",
    hint: "معرّف بكسل سناب شات.",
    placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  },
  {
    key: "linkedinPartnerId",
    label: "LinkedIn Insight",
    hint: "معرّف شريك LinkedIn.",
    placeholder: "123456",
  },
  {
    key: "clarityId",
    label: "Microsoft Clarity",
    hint: "معرّف مشروع Clarity لتسجيل الجلسات وخرائط الحرارة.",
    placeholder: "abcdefghij",
  },
];

export function ChannelsForm({
  initial,
  action,
}: {
  initial: ChannelSettings;
  action: (form: FormData) => Promise<ActionResult>;
}) {
  const editor = useEditor(action, "/admin/channels");
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [social, setSocial] = useState(initial.social);
  const [ads, setAds] = useState(initial.ads);

  function touchSocial(key: SocialKey, value: string) {
    editor.touch();
    setSocial((prev) => ({ ...prev, [key]: value }));
  }

  function clearSocial(key: SocialKey) {
    touchSocial(key, "");
  }

  function touchAd(key: keyof AdsConfig, value: string) {
    editor.touch();
    setAds((prev) => ({ ...prev, [key]: value }));
  }

  function clearAd(key: keyof AdsConfig) {
    touchAd(key, "");
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        form.set("phone", phone);
        form.set("email", email);
        for (const key of SOCIAL_KEYS) form.set(`social_${key}`, social[key]);
        for (const field of AD_FIELDS) form.set(`ads_${field.key}`, ads[field.key]);
        editor.save(form);
      }}
      onInput={editor.touch}
    >
      {editor.error ? <Notice tone="error">{editor.error}</Notice> : null}

      <Panel
        title="التواصل الأساسي"
        description="رقم الجوال يحدّد رابط واتساب في الشريط والتذييل وأزرار الطلب. اترك الحقل فارغاً لإخفاء وسيلة من الموقع."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="رقم الجوال / واتساب"
            value={phone}
            onChange={setPhone}
            error={editor.fields.phone}
            ltr
            placeholder="9665xxxxxxxx"
            hint="صيغة دولية بدون + أو مسافات. يُستخدم لزر اطلب موقعك ورابط wa.me."
          />
          <TextField
            label="البريد الإلكتروني"
            value={email}
            onChange={setEmail}
            error={editor.fields.email}
            ltr
            type="text"
            placeholder="hello@example.com"
          />
        </div>
        {phone ? (
          <p className="mt-3 text-sm text-brand-muted" dir="ltr">
            واتساب: https://wa.me/{phone.replace(/\D/g, "")}
          </p>
        ) : null}
      </Panel>

      <Panel
        title="حسابات التواصل"
        description="أضف الرابط الكامل للحساب. امسح الحقل أو اضغط حذف لإخفائه من التذييل وصفحة التواصل وبيانات SEO."
      >
        <div className="space-y-4">
          {SOCIAL_KEYS.map((key) => (
            <div key={key} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <TextField
                  label={SOCIAL_LABELS[key]}
                  value={social[key]}
                  onChange={(value) => touchSocial(key, value)}
                  error={editor.fields[`social_${key}`]}
                  ltr
                  type="url"
                  placeholder={`https://...`}
                />
              </div>
              <button
                type="button"
                onClick={() => clearSocial(key)}
                className="mb-0.5 h-10 shrink-0 rounded-pill px-4 text-sm font-medium text-brand-error transition duration-brand hover:bg-brand-error/10"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="منصات الإعلانات"
        description="فعّل التتبع بكتابة المعرّف فقط. اتركه فارغاً أو احذفه لتعطيل السكربت على الموقع. إن استخدمت GTM يمكنك إدارة البكسلات من هناك دون تكرارها هنا."
      >
        <div className="space-y-4">
          {AD_FIELDS.map((field) => (
            <div key={field.key} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <Field label={field.label} hint={field.hint} error={editor.fields[`ads_${field.key}`]}>
                  <input
                    value={ads[field.key]}
                    onChange={(event) => touchAd(field.key, event.target.value)}
                    className={inputClass}
                    dir="ltr"
                    placeholder={field.placeholder}
                    aria-invalid={editor.fields[`ads_${field.key}`] ? true : undefined}
                  />
                </Field>
              </div>
              <button
                type="button"
                onClick={() => clearAd(field.key)}
                className="mb-0.5 h-10 shrink-0 rounded-pill px-4 text-sm font-medium text-brand-error transition duration-brand hover:bg-brand-error/10"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={editor.pending}>
          {editor.pending ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
        </Button>
        <Button href="/admin" variant="secondary">
          رجوع
        </Button>
      </div>
    </form>
  );
}
