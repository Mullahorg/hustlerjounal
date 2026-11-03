import { Link } from "@tanstack/react-router";
import { List } from "lucide-react";
import type { Heading } from "@/lib/types";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;

  const list = (
    <nav aria-label="On this page" className="flex flex-col gap-2">
      <p className="eyebrow">On this page</p>
      <ul className="space-y-1.5 border-l-2 border-border pl-4">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${h.id}`}
              className="text-sm font-medium leading-snug text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop: sticky rail */}
      <aside className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">{list}</aside>

      {/* Mobile: collapsible drawer */}
      <details className="rounded-xl border border-border bg-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-bold text-foreground">
          <List className="h-4 w-4" aria-hidden />
          On this page
        </summary>
        <div className="px-4 pb-4">{list}</div>
      </details>
    </>
  );
}

export function AuthorCard({
  author,
}: {
  author: { name: string; slug: string; roleTitle: string | null; bio: string | null };
}) {
  const initials = author.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="mt-10 flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
      <span
        aria-hidden
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground"
      >
        {initials}
      </span>
      <div>
        <p className="eyebrow">Written by</p>
        <Link
          to="/authors/$slug"
          params={{ slug: author.slug }}
          className="text-base font-bold underline-offset-4 hover:underline"
        >
          {author.name}
        </Link>
        {author.roleTitle && <p className="text-sm font-medium text-muted-foreground">{author.roleTitle}</p>}
        {author.bio && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{author.bio}</p>}
      </div>
    </div>
  );
}
