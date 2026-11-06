import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { searchPosts, listPublishedPosts } from "@/lib/server/content.functions";
import { ArticleCardTyped } from "@/components/content/article-card";
import { EmptyState } from "@/components/content/section";
import { categories } from "@/lib/site";

export const Route = createFileRoute("/search")({
  staticData: { sitemap: false },
  validateSearch: zodValidator(z.object({ q: fallback(z.string(), "").default("") })),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps }) => {
    if (!deps.q.trim()) {
      const latest = await listPublishedPosts({ data: { limit: 6 } });
      return { results: [], latest };
    }
    const results = await searchPosts({ data: { query: deps.q } });
    return { results, latest: results.length ? [] : await listPublishedPosts({ data: { limit: 6 } }) };
  },
  head: () => ({
    meta: [
      { title: "Search | Hustler Journal" },
      { name: "description", content: "Search every article, guide, and story in Hustler Journal." },
      { property: "og:title", content: "Search | Hustler Journal" },
      { property: "og:description", content: "Search every article, guide, and story in Hustler Journal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-16">Search did not load.</div>,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { results, latest } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14">
      <p className="eyebrow">Search</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-normal md:text-5xl">
        {q ? `Results for "${q}"` : "Search the Journal"}
      </h1>

      <form action="/search" method="get" className="mt-6 flex gap-2" role="search">
        <label htmlFor="search-input" className="sr-only">
          Search the Journal
        </label>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id="search-input"
            name="q"
            defaultValue={q}
            placeholder="Search stories, guides, and help articles"
            className="h-13 w-full rounded-xl border border-input bg-card py-3.5 pl-12 pr-4 text-base"
          />
        </div>
        <button
          type="submit"
          className="h-13 rounded-xl bg-primary px-6 text-base font-bold text-primary-foreground hover:bg-primary/90"
        >
          Search
        </button>
      </form>

      {q && results.length === 0 && (
        <div className="mt-10 space-y-8">
          <EmptyState
            title="Nothing matched that search"
            body="Try a shorter phrase, or browse the sections below. Popular starting points: escrow, pricing, verification."
          />
          <section aria-labelledby="zero-results-latest">
            <h2 id="zero-results-latest" className="text-xl font-bold tracking-normal">
              Latest from the newsroom
            </h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => (
                <ArticleCardTyped key={p.id} post={p} />
              ))}
            </div>
          </section>
        </div>
      )}

      {!q && (
        <div className="mt-10">
          <h2 className="text-xl font-bold tracking-normal">Browse by section</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to={c.route}
                className="rounded-full border border-border bg-card px-4 py-2 text-base font-semibold hover:bg-accent-soft"
              >
                {c.name}
              </Link>
            ))}
          </div>
          {latest.length > 0 && (
            <section className="mt-12" aria-labelledby="popular-searches">
              <h2 id="popular-searches" className="text-xl font-bold tracking-normal">
                Latest articles
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latest.map((p) => (
                  <ArticleCardTyped key={p.id} post={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {q && results.length > 0 && (
        <div className="mt-10">
          <p className="text-base font-medium text-muted-foreground" aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <ArticleCardTyped key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
