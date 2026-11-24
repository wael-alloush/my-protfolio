import { deleteProject } from "@/app/admin/actions";
import { ItemList } from "@/components/admin/ItemList";
import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import { listProjects } from "@/lib/admin/store";

export const metadata = { title: "المشاريع" };

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function ProjectsAdminPage({ searchParams }: Props) {
  await requireAdmin();
  const [projects, { saved }] = await Promise.all([listProjects(), searchParams]);

  return (
    <>
      <PageHeader
        title="المشاريع"
        description="بالترتيب الذي تظهر به في صفحة الأعمال."
        action={
          <Button href="/admin/projects/new" size="sm">
            مشروع جديد
          </Button>
        }
      />
      <ItemList
        items={projects.map((project) => ({
          id: project.id ?? 0,
          title: project.name,
          meta: `${project.category} · الترتيب ${project.sortOrder}${project.featured ? " · في الرئيسية" : ""}`,
          status: project.status,
          path: `/portfolio/${project.slug}`,
        }))}
        saved={saved === "1"}
        editBase="/admin/projects"
        emptyText="لا توجد مشاريع بعد. أضف أول مشروع."
        deleteAction={deleteProject}
      />
    </>
  );
}
