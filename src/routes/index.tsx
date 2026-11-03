import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Radio } from "lucide-react";
import {
  listPublishedPosts,
  getTrendingPosts,
  getLatestUpdates,
} from "@/lib/server/content.functions";
import { ArticleCardTyped, PostMeta } from "@/components/content/article-card";
import { SectionHeading, EmptyState, CardGridSkeleton } from "@/components/content/section";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { categories } from "@/lib/site";
import type { PostCardDTO } from "@/lib/types";

type HomeData = {
  hero: PostCardDTO | null;
  trending: PostCardDTO[];
  latest: PostCardDTO[];
  picks: PostCardDTO[];
  updates: PostCardDTO[];
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hustler Journal: Practical guides and stories from HustlerLink" },
      {
        name: "description",
        content:
          "Success stories, safety guides, skills, and product updates for Africa's informal economy. The official publication of HustlerLink.",
      },
      { property: "og:title", content: "Hustler Journal: Practical guides and stories from HustlerLink" },
      {
        property: "og:description",
        content:
          "Success stories, safety guides, skills, and product updates for Africa's informal economy.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async (): Promise<HomeData> => {
    const [featuredRes, trending, latest, picks, updates] = await Promise.all([
      listPublishedPosts({ data: { featured: true, limit: 1 } }),
      getTrendingPosts({ data: { limit: 4 } }),
      listPublishedPosts({ data: { limit: 12 } }),
      listPublishedPosts({ data: { editorsPick: true, limit: 3 } }),
      getLatestUpdates({ data: { limit: 3 } }),
    ]);
    const hero = featuredRes.find(Boolean) ?? latest[0] ?? null;
    return {
      hero,
      trending: trending.filter((p) => p.slug !== hero?.slug).slice(0, 4),
      latest: latest.filter((p) => p.slug !== hero?.slug).slice(0, 9),
      picks: picks.filter((p) => p.slug !== hero?.slug).slice(0, 3),
      updates,
    };
  },
  component: HomePage,
  errorComponent: ({ error, reset }) => <LoadError error={error} reset={reset} />,
  pendingComponent: () => (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <CardGridSkeleton count={6} />
    </div>
  ),
});

function LoadError({ error, reset }: { error: unknown; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-xl font-bold">The Journal did not load</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error instanceof Error ? error.message : "Something went wrong."}
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}

const RAIL = [
  { label: "All stories", to: "/stories" },
  { label: "Safety and escrow", to: "/safety" },
  { label: "Skills and business", to: "/guides" },
  { label: "Product updates", to: "/updates" },
  { label: "Spotlights", to: "/stories" },
  { label: "Help Center", to: "/help" },
];

function HomePage() {
  const data = Route.useLoaderData();
  const { hero, trending, latest, picks, updates } = data;

  return (
    <div>
      {/* Category rail */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3" role="navigation" aria-label="Sections">
          {RAIL.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="shrink-0 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent-soft"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Hero */}
        {hero ? (
          <section aria-label="Featured story">
            <div className="grid items-center gap-8 rounded-3xl border border-border bg-card p-6 shadow-card md:grid-cols-2 md:p-10">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Featured story
                </span>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight leading-tight md:text-5xl">
                  <Link to="/stories/$slug" params={{ slug: hero.slug }} className="hover:underline underline-offset-4">
                    {hero.title}
                  </Link>
                </h1>
                {hero.excerpt && (
                  <p className="mt-4 max-w-[42ch] text-lg leading-relaxed text-muted-foreground">{hero.excerpt}</p>
                )}
                <PostMeta post={hero} className="mt-4" />
                <Link
                  to="/stories/$slug"
                  params={{ slug: hero.slug }}
                  className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Read the story
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              {hero.coverImageUrl && (
                <img
                  src={hero.coverImageUrl}
                  alt={hero.coverImageAlt ?? hero.title}
                  className="aspect-[4/3] w-full rounded-2xl border border-border object-cover"
                />
              )}
            </div>
          </section>
        ) : (
          <EmptyState
            title="The Journal is warming up"
            body="No stories have been published yet. Check back shortly."
          />
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <section className="mt-14" aria-labelledby="trending-heading">
            <SectionHeading
              eyebrow="Trending"
              title="What readers are reading"
              action={{ label: "All stories", to: "/stories" }}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((p) => (
                <ArticleCardTyped key={p.id} post={p} size="sm" />
              ))}
            </div>
          </section>
        )}

        {/* Latest grid */}
        <section className="mt-14" aria-labelledby="latest-heading">
          <SectionHeading eyebrow="Latest" title="Fresh from the newsroom" action={{ label: "Browse all", to: "/stories" }} />
          {latest.length === 0 ? (
            <EmptyState title="Nothing here yet" body="Articles will appear as the newsroom publishes them." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => (
                <ArticleCardTyped key={p.id} post={p} />
              ))}
            </div>
          )}
        </section>

        {/* Editors picks */}
        {picks.length > 0 && (
          <section className="mt-14" aria-labelledby="picks-heading">
            <SectionHeading eyebrow="Editors' picks" title="Handpicked by the newsroom" />
            <div className="grid gap-6 md:grid-cols-3">
              {picks.map((p) => (
                <div key={p.id} className="relative">
                  <span className="absolute -top-2.5 left-4 z-10 inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                    Pick
                  </span>
                  <ArticleCardTyped post={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Community spotlight */}
        <section className="mt-14" aria-labelledby="spotlight-heading">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border-2 border-primary/20 bg-primary-soft p-6 md:flex-row md:items-center md:p-10">
            <div>
              <p className="eyebrow">Community spotlight</p>
              <h2 id="spotlight-heading" className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                Real hustles, told by the people living them
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Every spotlight is reported and confirmed before publication. If your work changed
                after joining HustlerLink, we want to hear it.
              </p>
            </div>
            <Link
              to="/stories"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Read the spotlights
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Product updates strip */}
        {updates.length > 0 && (
          <section className="mt-14" aria-labelledby="updates-heading">
            <SectionHeading
              eyebrow="Product updates"
              title="What shipped this month"
              action={{ label: "All updates", to: "/updates" }}
            />
            <div className="grid gap-6 md:grid-cols-3">
              {updates.map((p) => (
                <ArticleCardTyped key={p.id} post={p} size="sm" />
              ))}
            </div>
          </section>
        )}

        {/* Pillars */}
        <section className="mt-14" aria-labelledby="pillars-heading">
          <SectionHeading eyebrow="Sections" title="Everything the Journal covers" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                to={c.route}
                className="rounded-2xl border border-border bg-card p-5 card-interactive"
              >
                <p className="flex items-center gap-2 font-bold">
                  {c.slug === "safety-escrow" ? (
                    <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                  ) : c.slug === "product-updates" ? (
                    <Radio className="h-4 w-4 text-primary" aria-hidden />
                  ) : null}
                  {c.name}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-14 rounded-2xl border border-border bg-card p-6 md:p-10">
          <div className="mb-6 max-w-2xl">
            <p className="eyebrow">Newsletter</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">The weekly Hustle Brief</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              One email each week: the best story, one practical guide, and what shipped. We confirm
              every subscription with a second email before anything else arrives.
            </p>
          </div>
          <NewsletterForm />
        </section>
      </div>
    </div>
  );
}
