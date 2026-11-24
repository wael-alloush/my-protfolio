import { DeleteButton } from "@/components/admin/DeleteButton";
import { Notice, StatusBadge } from "@/components/admin/ui";
import type { ActionResult } from "@/lib/admin/validate";
import type { Status } from "@/lib/content";
import Link from "next/link";

export type Item = {
  id: number;
  title: string;
  /** سطر تفاصيل قصير تحت العنوان */
  meta: string;
  status: Status;
  /** مسار الصفحة في الموقع العام */
  path: string;
};

/** قائمة عناصر قسم في اللوحة: تعديل، عرض في الموقع، حذف. */
export function ItemList({
  items,
  saved,
  editBase,
  emptyText,
  deleteAction,
}: {
  items: Item[];
  saved: boolean;
  /** مسار صفحة التعديل بدون الرقم، مثل ‎/admin/posts */
  editBase: string;
  emptyText: string;
  deleteAction: (id: number) => Promise<ActionResult>;
}) {
  return (
    <div className="space-y-4">
      {saved ? (
        <Notice tone="success">تم الحفظ. العناصر المنشورة تظهر في الموقع فوراً.</Notice>
      ) : null}

      {items.length === 0 ? (
        <p className="rounded-brand border border-brand-border px-5 py-12 text-center text-brand-muted">
          {emptyText}
        </p>
      ) : (
        <ul className="divide-y divide-brand-border overflow-hidden rounded-brand border border-brand-border bg-brand-surface">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4 sm:px-5"
            >
              <div className="min-w-0 flex-1 basis-60">
                <div className="flex items-center gap-2.5">
                  <Link
                    href={`${editBase}/${item.id}`}
                    className="truncate font-medium text-brand-cream transition duration-brand hover:text-brand-accent"
                  >
                    {item.title}
                  </Link>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-1 truncate text-sm text-brand-muted">{item.meta}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link
                  href={`${editBase}/${item.id}`}
                  className="text-sm font-medium text-brand-accent hover:underline"
                >
                  تعديل
                </Link>
                {item.status === "published" ? (
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-brand-cream hover:underline"
                  >
                    عرض
                  </a>
                ) : null}
                <DeleteButton id={item.id} name={item.title} action={deleteAction} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
