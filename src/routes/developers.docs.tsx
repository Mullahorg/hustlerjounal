import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/developers/docs")({
  head: () => ({
    meta: [
      { title: "Developer Documentation | Hustler Journal" },
      { name: "description", content: "Build on the HustlerLink platform with our APIs and tools." },
      { property: "og:title", content: "Developer Documentation | Hustler Journal" },
      { property: "og:description", content: "Build on the HustlerLink platform with our APIs and tools." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "developer-documentation", limit: 24 } }),
  component: IndexComponent,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function IndexComponent() {
  const posts = Route.useLoaderData();
  return <SectionIndex eyebrow="Developers" title="Developer Documentation" description="Build on the HustlerLink platform with our APIs and tools." posts={posts} />;
}
