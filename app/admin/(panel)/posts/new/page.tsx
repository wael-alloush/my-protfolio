import { PostForm } from "@/components/admin/PostForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { listPosts } from "@/lib/admin/store";
import { postCategories, todayInRiyadh } from "../shared";

export const metadata = { title: "مقال جديد" };

export default async function NewPostPage() {
  await requireAdmin();
  const posts = await listPosts();

  return (
    <>
      <PageHeader title="مقال جديد" />
      <PostForm post={null} categories={postCategories(posts)} today={todayInRiyadh()} />
    </>
  );
}
