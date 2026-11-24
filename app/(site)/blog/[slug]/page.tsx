import { MdxContent } from "@/components/blog/MdxContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getPost, getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { articleJsonLd, breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return createMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <Section className="bg-brand-surface">
      <JsonLd
        data={[
          articleJsonLd(post),
          breadcrumbJsonLd([
            { name: "الرئيسية", path: "/" },
            { name: "المدونة", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article className="mx-auto max-w-3xl">
        <p className="text-sm text-brand-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {" · "}
          {post.readingTime}
        </p>
        <h1 className="mt-3 text-display text-balance text-brand-cream">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-brand-muted">{post.description}</p>
        <div className="mt-10">
          <MdxContent content={post.content} />
        </div>
        <Button href="/blog" variant="secondary" className="mt-12">
          العودة للمدونة
        </Button>
      </article>
    </Section>
  );
}
