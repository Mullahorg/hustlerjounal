import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Legal and Policies | Hustler Journal" },
      { name: "description", content: "Terms, privacy, cookies, and platform policies in plain language." },
      { property: "og:title", content: "Legal and Policies | Hustler Journal" },
      { property: "og:description", content: "Terms, privacy, cookies, and platform policies in plain language." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "legal-policies", limit: 24 } }),
  component: IndexComponent,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function IndexComponent() {
  const posts = Route.useLoaderData();
  return <SectionIndex eyebrow="Legal" title="Legal and Policies" description="Terms, privacy, cookies, and platform policies in plain language." posts={posts} />;
}
