import { BlogGrid } from "@/components/blog/BlogGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { blogPage } from "@/content/ar";
import { getPosts } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "مدونة تصميم المواقع وصفحات الهبوط",
  description: blogPage.subtitle,
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero title={blogPage.title} subtitle={blogPage.subtitle} />
      <section className="pb-16 lg:pb-24">
        <Container>
          <BlogGrid posts={posts} />
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
