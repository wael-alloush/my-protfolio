"use client";

import { Button } from "@/components/ui/Button";
import { form } from "@/content/ar";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function ProjectRequestForm({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      siteType: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        whatsappUrl?: string;
      };

      if (!res.ok || !json.ok) {
        setStatus("error");
        return;
      }

      if (json.whatsappUrl) {
        window.open(json.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setStatus("success");
      reset();
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  });

  const fieldClass =
    "w-full rounded-pill border border-brand-cream/15 bg-brand-background px-5 py-3 text-brand-cream outline-none transition duration-brand placeholder:text-brand-muted focus:border-brand-accent focus:shadow-glow";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="mb-1.5 block font-medium text-brand-cream">
          {form.fields.name}
        </label>
        <input
          id="name"
          className={fieldClass}
          autoComplete="name"
          {...register("name")}
        />
        {errors.name ? (
          <p className="mt-1 text-sm text-brand-error">{errors.name.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block font-medium text-brand-cream">
          {form.fields.phone}
        </label>
        <input
          id="phone"
          className={fieldClass}
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="mt-1 text-sm text-brand-error">{errors.phone.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block font-medium text-brand-cream">
          {form.fields.email}
        </label>
        <input
          id="email"
          type="email"
          className={fieldClass}
          autoComplete="email"
          dir="ltr"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="siteType"
          className="mb-1.5 block font-medium text-brand-cream"
        >
          {form.fields.siteType}
        </label>
        <select id="siteType" className={`${fieldClass} rounded-brand`} {...register("siteType")}>
          <option value="">اختر...</option>
          {form.siteTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.siteType ? (
          <p className="mt-1 text-sm text-brand-error">
            {errors.siteType.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block font-medium text-brand-cream"
        >
          {form.fields.message}
        </label>
        <textarea
          id="message"
          rows={4}
          className={`${fieldClass} rounded-brand`}
          {...register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-sm text-brand-error">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {status === "success" ? (
        <p className="rounded-brand bg-brand-secondary/20 px-4 py-3 text-brand-accent">
          {form.success}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="rounded-brand bg-brand-error/10 px-4 py-3 text-brand-error">
          {form.error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? form.submitting : form.submit}
      </Button>
    </form>
  );
}
