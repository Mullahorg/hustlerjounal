import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/help")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Help Center | Hustler Journal" },
      { name: "description", content: "Step by step answers for buyers, workers, and businesses." },
      { property: "og:title", content: "Help Center | Hustler Journal" },
      { property: "og:description", content: "Step by step answers for buyers, workers, and businesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "help-center", limit: 24 } }),
  component: IndexComponent,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function IndexComponent() {
  const posts = Route.useLoaderData();
  return <SectionIndex eyebrow="Help Center" title="Help Center" description="Step by step answers for buyers, workers, and businesses." posts={posts} />;
}
