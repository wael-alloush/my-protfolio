import { PostForm } from "@/components/admin/PostForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { findPost, listPosts } from "@/lib/admin/store";
import { notFound } from "next/navigation";
import { postCategories, todayInRiyadh } from "../shared";

export const metadata = { title: "تعديل مقال" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  if (!/^\d{1,10}$/.test(id)) notFound();

  const [post, posts] = await Promise.all([findPost(Number(id)), listPosts()]);
  if (!post) notFound();

  return (
    <>
      <PageHeader title="تعديل مقال" description={post.title} />
      <PostForm post={post} categories={postCategories(posts)} today={todayInRiyadh()} />
    </>
  );
}
