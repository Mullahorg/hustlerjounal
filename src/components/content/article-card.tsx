import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { categoryRoute } from "@/lib/site";
import type { PostCardDTO } from "@/lib/types";

export function CategoryChip({
  name,
  slug,
  variant = "primary",
}: {
  name: string;
  slug: string;
  variant?: "primary" | "amber";
}) {
  const cls =
    variant === "amber"
      ? "bg-accent text-accent-foreground"
      : "bg-primary-soft text-primary";
  return (
    <Link
      to="/categories/$slug"
      params={{ slug }}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${cls}`}
    >
      {name}
    </Link>
  );
}

export function PostMeta({
  post,
  className = "",
}: {
  post: Pick<PostCardDTO, "author" | "publishedAt" | "readingTimeMinutes">;
  className?: string;
}) {
  return (
    <p className={`text-sm font-medium text-muted-foreground ${className}`}>
      {post.author ? `${post.author.name}. ` : ""}
      <time dateTime={post.publishedAt ?? undefined}>
        {post.publishedAt
          ? new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", year: "numeric" }).format(
              new Date(post.publishedAt),
            )
          : ""}
      </time>
      <span className="mx-1.5" aria-hidden>
        .
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" aria-hidden />
        {post.readingTimeMinutes} min read
      </span>
    </p>
  );
}

export function ArticleCard({
  post,
  size = "md",
}: {
  post: PostCardDTO;
  size?: "sm" | "md" | "lg";
}) {
  if (size === "sm") {
    return (
      <Link
        to="/stories/$slug"
        params={{ slug: post.slug }}
        className="group block rounded-xl border border-border bg-card p-4 card-interactive"
      >
        <PostMeta post={post} className="mb-1.5" />
        <h3 className="text-base font-bold leading-snug group-hover:underline underline-offset-4">
          {post.title}
        </h3>
      </Link>
    );
  }

  if (size === "lg") {
    return (
      <Link
        to="/stories/$slug"
        params={{ slug: post.slug }}
        className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-card card-interactive"
      >
        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.coverImageAlt ?? post.title}
            className="aspect-[16/9] w-full object-cover"
            loading="eager"
          />
        )}
        <div className="p-6 md:p-8">
          {post.categoryName && post.categorySlug && (
            <CategoryChip name={post.categoryName} slug={post.categorySlug} />
          )}
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight leading-tight group-hover:underline underline-offset-4 md:text-4xl">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-3 max-w-[42ch] text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          <PostMeta post={post} className="mt-4" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/stories/$slug"
      params={{ slug: post.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card card-interactive"
    >
      {post.coverImageUrl && (
        <img
          src={post.coverImageUrl}
          alt={post.coverImageAlt ?? post.title}
          className="aspect-[16/9] w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        {post.categoryName && post.categorySlug && (
          <CategoryChip name={post.categoryName} slug={post.categorySlug} />
        )}
        <h3 className="mt-3 text-lg font-bold leading-snug group-hover:underline underline-offset-4">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        <PostMeta post={post} className="mt-auto pt-3" />
      </div>
    </Link>
  );
}

/* Detail routes are type-specific, so cards map type to its section route. */
export function cardRoute(post: PostCardDTO): string {
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

export function ArticleCardTyped({ post, size = "md" }: { post: PostCardDTO; size?: "sm" | "md" | "lg" }) {
  return (
    <Link
      to={cardRoute(post)}
      params={{ slug: post.slug }}
      className={`group block overflow-hidden rounded-2xl border border-border bg-card shadow-card card-interactive ${
        size === "lg" ? "" : ""
      }`}
    >
      {post.coverImageUrl && size !== "sm" && (
        <img
          src={post.coverImageUrl}
          alt={post.coverImageAlt ?? post.title}
          className="aspect-[16/9] w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="p-5">
        {post.categoryName && post.categorySlug && (
          <CategoryChip name={post.categoryName} slug={post.categorySlug} />
        )}
        <h3
          className={`mt-3 font-bold leading-snug group-hover:underline underline-offset-4 ${
            size === "lg" ? "text-2xl md:text-3xl" : "text-lg"
          }`}
        >
          {post.title}
        </h3>
        {post.excerpt && size !== "sm" && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        <PostMeta post={post} className="mt-3" />
      </div>
    </Link>
  );
}
