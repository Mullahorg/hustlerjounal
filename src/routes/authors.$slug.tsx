import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getAuthorBySlug, listPostsByAuthor } from "@/lib/server/content.functions";
import { ArticleCardTyped } from "@/components/content/article-card";
import { EmptyState } from "@/components/content/section";

export const Route = createFileRoute("/authors/$slug")({
  loader: async ({ params }) => {
    const author = await getAuthorBySlug({ data: { slug: params.slug } });
    if (!author) throw notFound();
    const posts = await listPostsByAuthor({ data: { authorSlug: params.slug, limit: 30 } });
    return { author, posts };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.author.name ?? "Author"} | Hustler Journal` },
      {
        name: "description",
        content: loaderData?.author.bio ?? `Articles by ${loaderData?.author.name ?? "this author"}.`,
      },
      { property: "og:title", content: loaderData?.author.name ?? "Author" },
      { property: "og:description", content: loaderData?.author.bio ?? "" },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: AuthorPage,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-16">This author page did not load.</div>,
  notFoundComponent: () => (
    <EmptyState title="Author not found" body="The author may have changed bylines." action={{ label: "All stories", to: "/stories" }} />
  ),
});

function AuthorPage() {
  const { author, posts } = Route.useLoaderData();
  const initials = author.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14">
      <header className="flex items-start gap-5">
        <span
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-extrabold text-primary-foreground"
        >
          {initials}
        </span>
        <div>
          <p className="eyebrow">Author</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">{author.name}</h1>
          {author.roleTitle && <p className="mt-0.5 font-semibold text-muted-foreground">{author.roleTitle}</p>}
          {author.bio && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{author.bio}</p>}
        </div>
      </header>
      <div className="mt-10">
        {posts.length === 0 ? (
          <EmptyState
            title="No published articles yet"
            body="This author's first piece is in the works."
            action={{ label: "Browse the Journal", to: "/" }}
          />
        ) : (
          <>
            <h2 className="text-xl font-bold tracking-tight">Published articles ({posts.length})</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <ArticleCardTyped key={p.id} post={p} />
              ))}
            </div>
          </>
        )}
      </div>
      <p className="mt-10 text-sm text-muted-foreground">
        Want to write for the Journal?{" "}
        <Link to="/contact" className="font-bold text-primary underline-offset-4 hover:underline">
          Pitch the newsroom
        </Link>
        .
      </p>
    </div>
  );
}
