import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Success Stories | Hustler Journal" },
      { name: "description", content: "Real hustles from across Kenya. Workers and small businesses share what changed for them." },
      { property: "og:title", content: "Success Stories | Hustler Journal" },
      { property: "og:description", content: "Real hustles from across Kenya. Workers and small businesses share what changed for them." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "success-stories", limit: 24 } }),
  component: IndexComponent,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function IndexComponent() {
  const posts = Route.useLoaderData();
  return <SectionIndex eyebrow="Hustle Spotlight" title="Success Stories" description="Real hustles from across Kenya. Workers and small businesses share what changed for them." posts={posts} />;
}
