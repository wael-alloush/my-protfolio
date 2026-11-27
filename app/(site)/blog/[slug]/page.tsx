import { MdxContent } from "@/components/blog/MdxContent";
import { PostCta } from "@/components/blog/PostCta";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { getPost, getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { articleJsonLd, breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/lib/settings";
import Link from "next/link";
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
  const site = await getSiteConfig();

  return (
    <>
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

      <PageHero title={post.title} subtitle={post.description}>
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-brand-muted">
          <span className="badge-quiet">{post.category}</span>
          <span className="font-medium text-brand-cream/85">{site.name}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
        </div>
      </PageHero>

      <section className="pb-16 pt-4 sm:pb-20 lg:pb-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <MdxContent content={post.content} />
            <PostCta slug={post.slug} />
            <p className="mt-10 text-sm text-brand-muted">
              <Link href="/blog" className="transition duration-brand hover:text-brand-accent">
                ← العودة للمدونة
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
