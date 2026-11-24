import { ServiceForm } from "@/components/admin/ServiceForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { listServices } from "@/lib/admin/store";

export const metadata = { title: "خدمة جديدة" };

export default async function NewServicePage() {
  await requireAdmin();
  const services = await listServices();
  const lastOrder = Math.max(0, ...services.map((service) => service.sortOrder));

  return (
    <>
      <PageHeader title="خدمة جديدة" />
      <ServiceForm service={null} nextOrder={lastOrder + 1} />
    </>
  );
}
