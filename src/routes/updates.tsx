import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/updates")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Product Updates | Hustler Journal" },
      { name: "description", content: "What shipped on HustlerLink, and what it changes for you." },
      { property: "og:title", content: "Product Updates | Hustler Journal" },
      { property: "og:description", content: "What shipped on HustlerLink, and what it changes for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "product-updates", limit: 24 } }),
  component: IndexComponent,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function IndexComponent() {
  const posts = Route.useLoaderData();
  return <SectionIndex eyebrow="What shipped" title="Product Updates" description="What shipped on HustlerLink, and what it changes for you." posts={posts} />;
}
