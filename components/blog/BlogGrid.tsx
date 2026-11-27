import { Reveal } from "@/components/ui/Reveal";
import { blogPage } from "@/content/ar";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import Link from "next/link";

export function BlogGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-brand-muted">لا توجد مقالات بعد.</p>
    );
  }

  return (
    <ul className="grid gap-5 sm:gap-6 md:grid-cols-2">
      {posts.map((post, index) => {
        const featured = index === 0;
        return (
          <li
            key={post.slug}
            className={cn(featured && posts.length > 1 && "md:col-span-2")}
          >
            <Reveal delay={Math.min(index * 0.05, 0.2)} className="h-full">
              <article
                className={cn(
                  "surface-border flex h-full flex-col rounded-brand-xl p-6 transition duration-brand hover:border-brand-secondary/80 sm:p-7",
                  featured && "sm:p-8 lg:flex-row lg:items-end lg:gap-10 lg:p-10",
                )}
              >
                <div className={cn("min-w-0 flex-1", featured && "lg:max-w-3xl")}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta text-brand-muted">
                    <span className="badge-quiet">{post.category}</span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h2
                    className={cn(
                      "mt-4 font-extrabold leading-[1.35] text-brand-cream",
                      featured
                        ? "text-[1.5rem] sm:text-[1.85rem] lg:text-[2.1rem]"
                        : "text-h3",
                    )}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition duration-brand hover:text-brand-accent"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p
                    className={cn(
                      "mt-3 leading-7 text-brand-text-soft",
                      featured ? "text-lead lg:max-w-2xl" : "line-clamp-3 text-[0.9875rem]",
                    )}
                  >
                    {post.description}
                  </p>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className={cn(
                    "mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition duration-brand hover:gap-3",
                    featured && "lg:mt-0 lg:shrink-0",
                  )}
                >
                  {blogPage.readMore}
                  <span aria-hidden>←</span>
                </Link>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
