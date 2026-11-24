import { ProjectForm } from "@/components/admin/ProjectForm";
import { PageHeader } from "@/components/admin/ui";
import { portfolioPage } from "@/content/ar";
import { requireAdmin } from "@/lib/admin/auth";
import { listProjects } from "@/lib/admin/store";

export const metadata = { title: "مشروع جديد" };

export default async function NewProjectPage() {
  await requireAdmin();
  const projects = await listProjects();
  const lastOrder = Math.max(0, ...projects.map((project) => project.sortOrder));

  return (
    <>
      <PageHeader title="مشروع جديد" />
      <ProjectForm
        project={null}
        categories={portfolioPage.categories}
        nextOrder={lastOrder + 1}
      />
    </>
  );
}
