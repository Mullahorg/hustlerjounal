import { Link } from "@tanstack/react-router";
import { ArticleCardTyped } from "@/components/content/article-card";
import { SectionHeading, EmptyState } from "@/components/content/section";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import type { PostCardDTO } from "@/lib/types";

export function SectionIndex({
  eyebrow,
  title,
  description,
  posts,
}: {
  eyebrow: string;
  title: string;
  description: string;
  posts: PostCardDTO[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
      <header className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{description}</p>
      </header>

      <div className="mt-10">
        {posts.length === 0 ? (
          <EmptyState
            title="Nothing published here yet"
            body="The newsroom is working on it. Browse the rest of the Journal or search for a topic."
            action={{ label: "Search the Journal", to: "/search" }}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <ArticleCardTyped key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-card p-6 md:p-10">
        <SectionHeading
          eyebrow="Newsletter"
          title="Get the best of this section by email"
          action={{ label: "Manage preferences", to: "/newsletter" }}
        />
        <NewsletterForm />
      </section>
    </div>
  );
}

export function SectionNotFound({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <EmptyState
        title={title}
        body="This page has moved or never existed. The search page will find the current one."
        action={{ label: "Search the Journal", to: "/search" }}
      />
    </div>
  );
}
