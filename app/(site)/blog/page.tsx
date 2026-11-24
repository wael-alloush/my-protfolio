import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { blogPage } from "@/content/ar";
import { getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "المدونة",
  description: blogPage.subtitle,
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <section className="pb-16 pt-6 lg:pb-24 lg:pt-8">
      <Container>
        <Reveal>
          <h1 className="text-center text-[2rem] font-light leading-[1.35] text-brand-cream sm:text-[2.75rem] lg:text-[3.25rem]">
            {blogPage.titleBefore}{" "}
            <span className="font-extrabold">{blogPage.titleStrong}</span>{" "}
            {blogPage.titleAfter}
            <span className="mt-1 block font-extrabold text-brand-accent">
              {blogPage.titleAccent}
            </span>
          </h1>
        </Reveal>

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-7">
          {posts.map((post, index) => (
            <li key={post.slug}>
              <Reveal delay={(index % 3) * 0.06} className="h-full">
                <article className="flex h-full flex-col rounded-[1.25rem] border border-brand-border bg-brand-card px-5 pb-4 pt-5 text-center">
                  <span className="mx-auto w-fit rounded-pill bg-brand-accent px-3 py-1 text-xs font-medium text-brand-dark">
                    {post.category}
                  </span>
                  <h2 className="mt-4 text-[1.0625rem] font-medium leading-8 text-brand-cream">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-3 text-sm text-brand-accent"
                  >
                    {blogPage.readMore} «
                  </Link>
                  <p className="mt-auto pt-8 text-xs text-brand-muted">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
