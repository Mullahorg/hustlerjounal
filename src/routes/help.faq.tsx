import { createFileRoute, Link } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { EmptyState } from "@/components/content/section";
import type { PostCardDTO } from "@/lib/types";

export const Route = createFileRoute("/help/faq")({
  head: ({ loaderData }) => {
    const faqs = (loaderData?.posts ?? []).map((p) => ({
      "@type": "Question",
      name: p.title,
      acceptedAnswer: { "@type": "Answer", text: p.excerpt ?? "" },
    }));
    return {
      meta: [
        { title: "FAQ | Hustler Journal" },
        { name: "description", content: "Frequently asked questions about HustlerLink, answered plainly." },
        { property: "og:title", content: "FAQ | Hustler Journal" },
        { property: "og:description", content: "Frequently asked questions about HustlerLink." },
        { property: "og:type", content: "website" },
      ],
      scripts:
        faqs.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs,
                }),
              },
            ]
          : [],
    };
  },
  loader: async () => {
    const posts = await listPublishedPosts({ data: { categorySlug: "help-center", limit: 30 } });
    const kb = await listPublishedPosts({ data: { categorySlug: "knowledge-base", limit: 30 } });
    return { posts: [...posts, ...kb] as PostCardDTO[] };
  },
  component: FaqIndex,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-16">The FAQ did not load.</div>,
});

function FaqIndex() {
  const { posts } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <p className="eyebrow">FAQ</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">
        Frequently asked questions
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        Short answers first, full articles behind each question.
      </p>
      {posts.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No questions published yet"
            body="The Help Center is growing weekly."
            action={{ label: "Contact the team", to: "/contact" }}
          />
        </div>
      ) : (
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
          {posts.map((p) => (
            <details key={p.id} className="group px-5 py-4">
              <summary className="cursor-pointer list-none text-base font-bold underline-offset-4 group-open:text-primary">
                {p.title}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
              <Link
                to="/help/$slug"
                params={{ slug: p.slug }}
                className="mt-2 inline-block text-sm font-bold text-primary underline-offset-4 hover:underline"
              >
                Read the full answer
              </Link>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
