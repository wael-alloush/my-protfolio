import { ProjectForm } from "@/components/admin/ProjectForm";
import { PageHeader } from "@/components/admin/ui";
import { portfolioPage } from "@/content/ar";
import { requireAdmin } from "@/lib/admin/auth";
import { findProject } from "@/lib/admin/store";
import { notFound } from "next/navigation";

export const metadata = { title: "تعديل مشروع" };

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  if (!/^\d{1,10}$/.test(id)) notFound();

  const project = await findProject(Number(id));
  if (!project) notFound();

  return (
    <>
      <PageHeader title="تعديل مشروع" description={project.name} />
      <ProjectForm
        project={project}
        categories={portfolioPage.categories}
        nextOrder={project.sortOrder}
      />
    </>
  );
}
