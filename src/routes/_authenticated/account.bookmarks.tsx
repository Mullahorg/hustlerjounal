import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { listBookmarks } from "@/lib/server/account.functions";
import { ArticleCardTyped } from "@/components/content/article-card";
import { EmptyState } from "@/components/content/section";
import type { PostCardDTO } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/account/bookmarks")({
  head: () => ({
    meta: [{ title: "Saved articles | Hustler Journal" }, { name: "robots", content: "noindex" }],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const fetchBookmarks = useServerFn(listBookmarks);
  const [bookmarks, setBookmarks] = useState<PostCardDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchBookmarks().then(
      (rows) => {
        if (!active) return;
        setBookmarks(
          rows.map((b) => ({
            id: b.postId,
            type: b.type,
            slug: b.slug,
            title: b.title,
            subtitle: null,
            excerpt: b.excerpt,
            coverImageUrl: b.coverImageUrl,
            coverImageAlt: null,
            readingTimeMinutes: b.readingTimeMinutes,
            publishedAt: b.publishedAt,
            updatedAt: null,
            featured: false,
            editorsPick: false,
            categorySlug: null,
            categoryName: b.categoryName,
            author: null,
          })),
        );
      },
      (e) => {
        if (active) setError(e instanceof Error ? e.message : "Could not load your bookmarks.");
      },
    );
    return () => {
      active = false;
    };
  }, [fetchBookmarks]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/account" className="hover:text-foreground">
          Account
        </Link>{" "}
        / <span className="font-medium text-foreground">Saved articles</span>
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Saved articles</h1>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {bookmarks && bookmarks.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title="Nothing saved yet"
            body="Tap Save on any article to keep it here for later."
            action={{ label: "Browse the Journal", to: "/" }}
          />
        </div>
      )}
      {bookmarks && bookmarks.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((p) => (
            <ArticleCardTyped key={p.id} post={p} />
          ))}
        </div>
      )}
      {!bookmarks && !error && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl border border-border bg-muted" />
          ))}
        </div>
      )}
    </div>
  );
}
