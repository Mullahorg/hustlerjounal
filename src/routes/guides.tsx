import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Skills and Business Tips | Hustler Journal" },
      { name: "description", content: "Pricing, registering a business, writing job posts, and running a tighter operation." },
      { property: "og:title", content: "Skills and Business Tips | Hustler Journal" },
      { property: "og:description", content: "Pricing, registering a business, writing job posts, and running a tighter operation." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "skills-business-tips", limit: 24 } }),
  component: IndexComponent,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function IndexComponent() {
  const posts = Route.useLoaderData();
  return <SectionIndex eyebrow="Guides" title="Skills and Business Tips" description="Pricing, registering a business, writing job posts, and running a tighter operation." posts={posts} />;
}
