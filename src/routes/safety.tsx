import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety and Escrow | Hustler Journal" },
      { name: "description", content: "How escrow works, what to check before you pay, and how to stay safe on every job." },
      { property: "og:title", content: "Safety and Escrow | Hustler Journal" },
      { property: "og:description", content: "How escrow works, what to check before you pay, and how to stay safe on every job." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "safety-escrow", limit: 24 } }),
  component: IndexComponent,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function IndexComponent() {
  const posts = Route.useLoaderData();
  return <SectionIndex eyebrow="Safety" title="Safety and Escrow" description="How escrow works, what to check before you pay, and how to stay safe on every job." posts={posts} />;
}
