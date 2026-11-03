import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  getPostBySlug,
  getRelatedPosts,
  getPrevNextPosts,
  recordPostView,
} from "@/lib/server/content.functions";
import { getRequestOrigin } from "@/lib/server/origin.functions";
import { ArticleView } from "@/components/article/article-view";
import { SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    const [related, pn, origin] = await Promise.all([
      getRelatedPosts({
        data: { categorySlug: post.categorySlug ?? "", excludeSlug: post.slug, limit: 4 },
      }),
      post.publishedAt
        ? getPrevNextPosts({ data: { publishedAt: post.publishedAt } })
        : Promise.resolve({ prev: null, next: null }),
      getRequestOrigin(),
    ]);
    recordPostView({ data: { slug: params.slug } }).catch(() => undefined);
    return { post, related, prev: pn.prev, next: pn.next, origin };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable | Hustler Journal" }] };
    }
    const { post, origin } = loaderData;
    const meta = [
      { title: `${post.seoTitle ?? post.title} | Hustler Journal` },
      { name: "description", content: post.seoDescription ?? post.excerpt ?? "" },
      { property: "og:title", content: post.title },
      { property: "og:description", content: post.excerpt ?? "" },
      { property: "og:type", content: "article" },
    ];
    if (post.coverImageUrl) {
      meta.push({ property: "og:image", content: `${origin}${post.coverImageUrl}` });
      meta.push({ name: "twitter:image", content: `${origin}${post.coverImageUrl}` });
    }
    return {
      meta,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": post.schemaType,
            headline: post.title,
            description: post.excerpt ?? undefined,
            datePublished: post.publishedAt ?? undefined,
            dateModified: post.updatedAt ?? undefined,
            author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
            image: post.coverImageUrl ? `${origin}${post.coverImageUrl}` : undefined,
          }),
        },
      ],
    };
  },
  component: ArticleComponent,
  errorComponent: () => <SectionNotFound title="This article did not load" />,
  notFoundComponent: () => <SectionNotFound title="Article not found" />,
});

function ArticleComponent() {
  const { post, related, prev, next } = Route.useLoaderData();
  return <ArticleView post={post} related={related} prev={prev} next={next} />;
}
