import { deletePost } from "@/app/admin/actions";
import { ItemList } from "@/components/admin/ItemList";
import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import { listPosts } from "@/lib/admin/store";
import { formatDate } from "@/lib/format";

export const metadata = { title: "المقالات" };

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function PostsPage({ searchParams }: Props) {
  await requireAdmin();
  const [posts, { saved }] = await Promise.all([listPosts(), searchParams]);

  return (
    <>
      <PageHeader
        title="المقالات"
        description="مرتبة من الأحدث إلى الأقدم حسب تاريخ النشر."
        action={
          <Button href="/admin/posts/new" size="sm">
            مقال جديد
          </Button>
        }
      />
      <ItemList
        items={posts.map((post) => ({
          id: post.id ?? 0,
          title: post.title,
          meta: `${post.category} · ${formatDate(post.date)}`,
          status: post.status,
          path: `/blog/${post.slug}`,
        }))}
        saved={saved === "1"}
        editBase="/admin/posts"
        emptyText="لا توجد مقالات بعد. أضف أول مقال."
        deleteAction={deletePost}
      />
    </>
  );
}
