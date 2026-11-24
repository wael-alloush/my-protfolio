import { deleteService } from "@/app/admin/actions";
import { ItemList } from "@/components/admin/ItemList";
import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import { listServices } from "@/lib/admin/store";

export const metadata = { title: "الخدمات" };

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function ServicesAdminPage({ searchParams }: Props) {
  await requireAdmin();
  const [services, { saved }] = await Promise.all([listServices(), searchParams]);

  return (
    <>
      <PageHeader
        title="الخدمات"
        description="بالترتيب الذي تظهر به في صفحة الخدمات."
        action={
          <Button href="/admin/services/new" size="sm">
            خدمة جديدة
          </Button>
        }
      />
      <ItemList
        items={services.map((service) => ({
          id: service.id ?? 0,
          title: service.title,
          meta: `الترتيب ${service.sortOrder} · عدد الأقسام ${service.sections.length}`,
          status: service.status,
          path: `/services/${service.slug}`,
        }))}
        saved={saved === "1"}
        editBase="/admin/services"
        emptyText="لا توجد خدمات بعد. أضف أول خدمة."
        deleteAction={deleteService}
      />
    </>
  );
}
