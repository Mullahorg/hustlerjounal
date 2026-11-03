import { Link } from "@tanstack/react-router";
import { ReadingProgressBar } from "@/components/article/reading-progress";
import { ShareDrawer } from "@/components/article/share-drawer";
import { BookmarkButton } from "@/components/article/bookmark-button";
import { TableOfContents, AuthorCard } from "@/components/article/table-of-contents";
import { CategoryChip, ArticleCardTyped } from "@/components/content/article-card";
import { CtaBanner } from "@/components/content/cta-banner";
import { formatDate } from "@/lib/site";
import type { PostCardDTO, PostDetailDTO } from "@/lib/types";

function cardRoute(post: PostCardDTO): string {
  const map: Record<string, string> = {
    story: "/stories/$slug",
    guide: "/guides/$slug",
    safety: "/safety/$slug",
    update: "/updates/$slug",
    announcement: "/news/$slug",
    news: "/news/$slug",
    help: "/help/$slug",
    policy: "/legal/$slug",
    doc: "/developers/docs/$slug",
  };
  return map[post.type] ?? "/stories/$slug";
}

const CTA_BY_CATEGORY: Record<string, "worker" | "buyer" | "safety" | "developer" | "newsletter"> = {
  "success-stories": "worker",
  "safety-escrow": "safety",
  "skills-business-tips": "buyer",
  "product-updates": "buyer",
  "developer-documentation": "developer",
  "api-documentation": "developer",
  "help-center": "buyer",
  "knowledge-base": "buyer",
};

export function ArticleView({
  post,
  related,
  prev,
  next,
}: {
  post: PostDetailDTO;
  related: PostCardDTO[];
  prev: PostCardDTO | null;
  next: PostCardDTO | null;
}) {
  const showUpdated =
    post.updatedAt &&
    post.publishedAt &&
    new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > 24 * 3600 * 1000;

  return (
    <>
      <ReadingProgressBar />
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <TableOfContents headings={post.headings} />
            </div>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <article>
              <header className="max-w-3xl">
                {post.categoryName && post.categorySlug && (
                  <CategoryChip name={post.categoryName} slug={post.categorySlug} />
                )}
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight leading-tight md:text-5xl">
                  {post.title}
                </h1>
                {post.subtitle && (
                  <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{post.subtitle}</p>
                )}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    By{" "}
                    {post.author ? (
                      <Link
                        to="/authors/$slug"
                        params={{ slug: post.author.slug }}
                        className="font-bold text-foreground underline-offset-4 hover:underline"
                      >
                        {post.author.name}
                      </Link>
                    ) : (
                      "the Hustler Journal newsroom"
                    )}
                    <span className="mx-1.5" aria-hidden>.</span>
                    <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt ?? "")}</time>
                    {showUpdated && (
                      <span>
                        {" "}Updated <time dateTime={post.updatedAt ?? undefined}>{formatDate(post.updatedAt ?? "")}</time>
                      </span>
                    )}
                    <span className="mx-1.5" aria-hidden>.</span>
                    {post.readingTimeMinutes} min read
                  </p>
                  <div className="flex items-center gap-2">
                    <ShareDrawer title={post.title} />
                    <BookmarkButton slug={post.slug} />
                  </div>
                </div>
              </header>

              {post.coverImageUrl && (
                <img
                  src={post.coverImageUrl}
                  alt={post.coverImageAlt ?? post.title}
                  className="mt-8 aspect-[16/9] w-full rounded-2xl border border-border object-cover"
                />
              )}

              <div
                className="article-body mt-10"
                // Rendered server-side from Markdown by a strictly escaping renderer.
                dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
              />

              {post.author && (
                <AuthorCard
                  author={{
                    name: post.author.name,
                    slug: post.author.slug,
                    roleTitle: post.author.roleTitle,
                    bio: null,
                  }}
                />
              )}

              <CtaBanner variant={CTA_BY_CATEGORY[post.categorySlug ?? ""] ?? "newsletter"} />
            </article>

            {related.length > 0 && (
              <section className="mt-14" aria-labelledby="related-heading">
                <h2 id="related-heading" className="text-2xl font-bold tracking-tight">
                  Related reading
                </h2>
                <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.slice(0, 3).map((p) => (
                    <ArticleCardTyped key={p.id} post={p} />
                  ))}
                </div>
              </section>
            )}

            {(prev || next) && (
              <nav aria-label="More articles" className="mt-12 grid gap-4 sm:grid-cols-2">
                {prev && (
                  <Link
                    to={cardRoute(prev)}
                    params={{ slug: prev.slug }}
                    className="rounded-2xl border border-border bg-card p-5 card-interactive"
                  >
                    <p className="eyebrow">Newer</p>
                    <p className="mt-1 font-bold leading-snug">{prev.title}</p>
                  </Link>
                )}
                {next && (
                  <Link
                    to={cardRoute(next)}
                    params={{ slug: next.slug }}
                    className="rounded-2xl border border-border bg-card p-5 card-interactive sm:text-right"
                  >
                    <p className="eyebrow">Older</p>
                    <p className="mt-1 font-bold leading-snug">{next.title}</p>
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
