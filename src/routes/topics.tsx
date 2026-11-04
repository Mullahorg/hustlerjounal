import { createFileRoute, Link } from "@tanstack/react-router";
import { listTopics, listSeries } from "@/lib/server/content.functions";
import { EmptyState } from "@/components/content/section";

export const Route = createFileRoute("/topics")({
  head: () => ({
    meta: [
      { title: "Topics | Hustler Journal" },
      { name: "description", content: "Curated topic clusters: pricing, buying safely, and growing a trade business." },
      { property: "og:title", content: "Topics | Hustler Journal" },
      { property: "og:description", content: "Curated topic clusters across the Hustler Journal." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async () => {
    const [topics, series] = await Promise.all([listTopics(), listSeries()]);
    return { topics, series };
  },
  component: TopicsIndex,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-16">Topics did not load.</div>,
});

function TopicsIndex() {
  const { topics, series } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14">
      <p className="eyebrow">Topics</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">Topic clusters</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Topics gather related articles so you can read around a subject instead of hunting for
        single posts.
      </p>
      {topics.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No topics yet"
            body="Curated topics are on the way."
            action={{ label: "Browse stories", to: "/stories" }}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {topics.map((t) => (
            <Link
              key={t.id}
              to="/topics/$slug"
              params={{ slug: t.slug }}
              className="rounded-2xl border border-border bg-card p-5 card-interactive"
            >
              <h2 className="text-lg font-bold">{t.name}</h2>
              {t.description && <p className="mt-1.5 text-sm text-muted-foreground">{t.description}</p>}
            </Link>
          ))}
        </div>
      )}

      {series.length > 0 && (
        <section className="mt-14" aria-labelledby="series-heading">
          <h2 id="series-heading" className="text-2xl font-bold tracking-tight">
            Series
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {series.map((s) => (
              <Link
                key={s.id}
                to="/series/$slug"
                params={{ slug: s.slug }}
                className="rounded-2xl border-2 border-accent/40 bg-accent-soft p-5 card-interactive"
              >
                <h3 className="text-lg font-bold">{s.name}</h3>
                {s.description && <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
