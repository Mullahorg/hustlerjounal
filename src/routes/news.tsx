import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";
import type { PostCardDTO } from "@/lib/types";

const NEWS_CATEGORIES = ["community-news", "company-announcements"];

export const Route = createFileRoute("/news")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "News | Hustler Journal" },
      {
        name: "description",
        content: "Community news and company announcements from HustlerLink, in plain language.",
      },
      { property: "og:title", content: "News | Hustler Journal" },
      {
        property: "og:description",
        content: "Community news and company announcements from HustlerLink.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async (): Promise<PostCardDTO[]> => {
    const all = await listPublishedPosts({ data: { limit: 40 } });
    return all.filter((p) => p.categorySlug && NEWS_CATEGORIES.includes(p.categorySlug));
  },
  component: NewsIndex,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function NewsIndex() {
  const posts = Route.useLoaderData();
  return (
    <SectionIndex
      eyebrow="News"
      title="Community and company news"
      description="Meetups, partnerships, announcements, and news from the HustlerLink community."
      posts={posts}
    />
  );
}
