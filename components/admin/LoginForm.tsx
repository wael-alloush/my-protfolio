"use client";

import { login } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/admin/fields";
import { Notice } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/lib/admin/validate";
import { useActionState } from "react";

const initial: ActionResult = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="space-y-5">
      <Field label="كلمة المرور">
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          autoFocus
          dir="ltr"
          className={inputClass}
        />
      </Field>
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "جارٍ الدخول…" : "دخول"}
      </Button>
    </form>
  );
}
