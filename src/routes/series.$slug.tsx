import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getSeriesBySlug, listPostsBySeries } from "@/lib/server/content.functions";
import { ArticleCardTyped } from "@/components/content/article-card";
import { EmptyState } from "@/components/content/section";

export const Route = createFileRoute("/series/$slug")({
  loader: async ({ params }) => {
    const series = await getSeriesBySlug({ data: { slug: params.slug } });
    if (!series) throw notFound();
    const posts = await listPostsBySeries({ data: { seriesId: series.id } });
    return { series, posts };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.series.name ?? "Series"} | Hustler Journal` },
      {
        name: "description",
        content: loaderData?.series.description ?? "An ordered article series on Hustler Journal.",
      },
      { property: "og:title", content: loaderData?.series.name ?? "Series" },
      { property: "og:description", content: loaderData?.series.description ?? "" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SeriesPage,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-16">This series did not load.</div>,
  notFoundComponent: () => (
    <EmptyState title="Series not found" body="The series may have been renamed." action={{ label: "All topics", to: "/topics" }} />
  ),
});

function SeriesPage() {
  const { series, posts } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/topics" className="hover:text-foreground">
          Topics
        </Link>{" "}
        / <span className="font-medium text-foreground">Series</span>
      </nav>
      <p className="eyebrow mt-3">Series</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">{series.name}</h1>
      {series.description && (
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">{series.description}</p>
      )}
      {posts.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="This series is just starting"
            body="Part one is in the works."
            action={{ label: "Browse the Journal", to: "/" }}
          />
        </div>
      ) : (
        <ol className="mt-10 space-y-4">
          {posts.map((p, i) => (
            <li key={p.id}>
              <Link
                to="/stories/$slug"
                params={{ slug: p.slug }}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 card-interactive"
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground"
                >
                  {i + 1}
                </span>
                <div>
                  <h2 className="text-lg font-bold leading-snug">{p.title}</h2>
                  {p.excerpt && <p className="mt-1 text-sm text-muted-foreground">{p.excerpt}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
