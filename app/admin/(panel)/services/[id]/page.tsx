import { ServiceForm } from "@/components/admin/ServiceForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { findService } from "@/lib/admin/store";
import { notFound } from "next/navigation";

export const metadata = { title: "تعديل خدمة" };

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  if (!/^\d{1,10}$/.test(id)) notFound();

  const service = await findService(Number(id));
  if (!service) notFound();

  return (
    <>
      <PageHeader title="تعديل خدمة" description={service.title} />
      <ServiceForm service={service} nextOrder={service.sortOrder} />
    </>
  );
}
