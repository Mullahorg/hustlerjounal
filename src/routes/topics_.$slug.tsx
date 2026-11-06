import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getTopicBySlug, listPostsByTopic } from "@/lib/server/content.functions";
import { ArticleCardTyped } from "@/components/content/article-card";
import { EmptyState } from "@/components/content/section";

export const Route = createFileRoute("/topics_/$slug")({
  staticData: { sitemap: true },
  loader: async ({ params }) => {
    const topic = await getTopicBySlug({ data: { slug: params.slug } });
    if (!topic) throw notFound();
    const posts = await listPostsByTopic({ data: { topicId: topic.id } });
    return { topic, posts };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.topic.name ?? "Topic"} | Hustler Journal` },
      { name: "description", content: loaderData?.topic.description ?? "A curated topic on Hustler Journal." },
      { property: "og:title", content: loaderData?.topic.name ?? "Topic" },
      { property: "og:description", content: loaderData?.topic.description ?? "" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TopicPage,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-16">This topic did not load.</div>,
  notFoundComponent: () => <EmptyState title="Topic not found" body="The topic may have been renamed." action={{ label: "All topics", to: "/topics" }} />,
});

function TopicPage() {
  const { topic, posts } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-base text-muted-foreground">
        <Link to="/topics" className="hover:text-foreground">
          Topics
        </Link>{" "}
        / <span className="font-medium text-foreground">{topic.name}</span>
      </nav>
      <h1 className="mt-3 text-4xl font-extrabold tracking-normal md:text-5xl">{topic.name}</h1>
      {topic.description && (
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">{topic.description}</p>
      )}
      <div className="mt-10">
        {posts.length === 0 ? (
          <EmptyState
            title="Nothing filed here yet"
            body="Articles for this topic are being written."
            action={{ label: "Browse the Journal", to: "/" }}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <ArticleCardTyped key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
