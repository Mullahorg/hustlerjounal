import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPostBySlug } from "@/lib/server/content.functions";
import { ArticleView } from "@/components/article/article-view";
import { SectionNotFound } from "@/components/content/section-index";

/* Versioned API docs: /developers/api/v1 renders the current reference article. */
export const Route = createFileRoute("/developers/api/$version")({
  loader: async ({ params }) => {
    if (params.version !== "v1") throw notFound();
    const post = await getPostBySlug({ data: { slug: "getting-started-hustlerlink-api" } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "API"} | Hustler Journal` },
      { name: "description", content: loaderData?.excerpt ?? "Versioned HustlerLink API documentation." },
      { property: "og:title", content: loaderData?.title ?? "API" },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: VersionedApiDocs,
  errorComponent: () => <SectionNotFound title="This version did not load" />,
  notFoundComponent: () => <SectionNotFound title="Unknown API version" />,
});

function VersionedApiDocs() {
  const post = Route.useLoaderData();
  return <ArticleView post={post} related={[]} prev={null} next={null} />;
}
