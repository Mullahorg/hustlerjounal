import { createFileRoute, Link } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { EmptyState } from "@/components/content/section";
import { formatDate } from "@/lib/site";

export const Route = createFileRoute("/updates_/release-notes")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Release Notes | Hustler Journal" },
      {
        name: "description",
        content: "A running changelog of everything that shipped on HustlerLink, newest first.",
      },
      { property: "og:title", content: "Release Notes | Hustler Journal" },
      { property: "og:description", content: "A running changelog of everything that shipped on HustlerLink." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "product-updates", limit: 50 } }),
  component: ReleaseNotes,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-16">Release notes did not load.</div>,
});

function ReleaseNotes() {
  const posts = Route.useLoaderData();
  const byMonth = new Map<string, typeof posts>();
  for (const p of posts) {
    if (!p.publishedAt) continue;
    const label = new Intl.DateTimeFormat("en-KE", { month: "long", year: "numeric" }).format(
      new Date(p.publishedAt),
    );
    if (!byMonth.has(label)) byMonth.set(label, []);
    byMonth.get(label)!.push(p);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <p className="eyebrow">Changelog</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-normal md:text-5xl">Release notes</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        Everything that shipped on HustlerLink, newest first. Every entry states what changed and
        what it means for you.
      </p>
      {byMonth.size === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No releases recorded yet"
            body="When the platform ships, every change is logged here."
            action={{ label: "See product updates", to: "/updates" }}
          />
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {[...byMonth.entries()].map(([month, items]) => (
            <section key={month}>
              <h2 className="text-xl font-bold tracking-normal">{month}</h2>
              <ul className="mt-4 space-y-4">
                {items.map((p) => (
                  <li key={p.id} className="rounded-xl border border-border bg-card p-5">
                    <p className="text-base font-bold uppercase tracking-normal text-muted-foreground">
                      {formatDate(p.publishedAt ?? "")}
                    </p>
                    <Link
                      to="/updates/$slug"
                      params={{ slug: p.slug }}
                      className="mt-1 block text-lg font-bold leading-snug underline-offset-4 hover:underline"
                    >
                      {p.title}
                    </Link>
                    {p.excerpt && <p className="mt-1.5 text-base text-muted-foreground">{p.excerpt}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
