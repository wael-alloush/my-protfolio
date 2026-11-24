"use client";

import { Notice, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

/** خطأ أثناء تحميل صفحة في اللوحة، وغالباً انقطاع الاتصال بقاعدة البيانات بعد أن كان يعمل. */
export default function PanelError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <>
      <PageHeader title="تعذّر تحميل الصفحة" />
      <Notice tone="error">
        انقطع الاتصال بقاعدة البيانات أثناء تحميل الصفحة. أعد المحاولة بعد لحظات. الموقع
        العام يبقى معروضاً بآخر نسخة محفوظة.
      </Notice>
      <Button type="button" size="sm" className="mt-5" onClick={() => reset()}>
        إعادة المحاولة
      </Button>
    </>
  );
}
