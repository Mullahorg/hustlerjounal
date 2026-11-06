import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/investors")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Investor Updates | Hustler Journal" },
      { name: "description", content: "Numbers, milestones, and plans, shared openly." },
      { property: "og:title", content: "Investor Updates | Hustler Journal" },
      { property: "og:description", content: "Numbers, milestones, and plans, shared openly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "investor-updates", limit: 24 } }),
  component: IndexComponent,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function IndexComponent() {
  const posts = Route.useLoaderData();
  return <SectionIndex eyebrow="Investors" title="Investor Updates" description="Numbers, milestones, and plans, shared openly." posts={posts} />;
}
