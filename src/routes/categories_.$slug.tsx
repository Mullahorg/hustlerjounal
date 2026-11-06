import { createFileRoute, notFound } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex } from "@/components/content/section-index";
import { EmptyState } from "@/components/content/section";
import { categoryBySlug } from "@/lib/site";

/* SEO fallback index for any category slug. */
export const Route = createFileRoute("/categories_/$slug")({
  staticData: { sitemap: true },
  loader: async ({ params }) => {
    const category = categoryBySlug(params.slug);
    if (!category) throw notFound();
    const posts = await listPublishedPosts({ data: { categorySlug: params.slug, limit: 24 } });
    return { category, posts };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category.name ?? "Category"} | Hustler Journal` },
      { name: "description", content: loaderData?.category.description ?? "Articles in this category." },
      { property: "og:title", content: loaderData?.category.name ?? "Category" },
      { property: "og:description", content: loaderData?.category.description ?? "" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoryPage,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-16">This category did not load.</div>,
  notFoundComponent: () => (
    <EmptyState title="Category not found" body="The category may have been renamed." action={{ label: "All stories", to: "/stories" }} />
  ),
});

function CategoryPage() {
  const { category, posts } = Route.useLoaderData();
  return (
    <SectionIndex
      eyebrow="Category"
      title={category.name}
      description={category.description}
      posts={posts}
    />
  );
}
