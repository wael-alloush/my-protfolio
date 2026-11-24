"use client";

import type { ActionResult } from "@/lib/admin/validate";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DeleteButton({
  id,
  name,
  action,
}: {
  id: number;
  name: string;
  action: (id: number) => Promise<ActionResult>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function remove() {
    if (!window.confirm(`حذف «${name}» نهائياً؟ لا يمكن التراجع. الرابط المنشور سيُحوَّل إلى فهرس القسم.`)) {
      return;
    }
    startTransition(async () => {
      try {
        const result = await action(id);
        if (result.ok) {
          setError("");
          router.refresh();
          return;
        }
        setError(result.error ?? "تعذّر الحذف.");
      } catch {
        setError("تعذّر الاتصال بالخادم.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="text-sm font-medium text-brand-error transition duration-brand hover:underline disabled:opacity-60"
      >
        {pending ? "جارٍ الحذف…" : "حذف"}
      </button>
      {error ? (
        <span role="alert" className="basis-full text-sm text-brand-error">
          {error}
        </span>
      ) : null}
    </>
  );
}
