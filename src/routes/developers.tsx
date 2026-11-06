import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Code2, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/developers")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Developers | Hustler Journal" },
      {
        name: "description",
        content: "Documentation, API reference, and tools for building on the HustlerLink platform.",
      },
      { property: "og:title", content: "Developers | Hustler Journal" },
      {
        property: "og:description",
        content: "Documentation, API reference, and tools for building on the HustlerLink platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DevelopersLanding,
});

const CARDS = [
  {
    icon: BookOpen,
    title: "Documentation",
    body: "Guides for authenticating, paginating, and integrating with the platform.",
    to: "/developers/docs",
    label: "Read the docs",
  },
  {
    icon: Code2,
    title: "API reference",
    body: "The REST reference for v1: endpoints, parameters, errors, and webhooks.",
    to: "/developers/api",
    label: "Open the reference",
  },
  {
    icon: ShieldCheck,
    title: "Start with the quickstart",
    body: "Make your first request in five minutes with curl or any HTTP client.",
    to: "/developers/docs/getting-started-hustlerlink-api",
    label: "Quickstart",
  },
];

function DevelopersLanding() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
      <p className="eyebrow">Developers</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-normal md:text-5xl">Build on HustlerLink</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        The HustlerLink API gives partners programmatic access to jobs, workers, and businesses.
        Everything is documented here first, and the docs ship with the platform.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.title} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <c.icon className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-xl font-bold">{c.title}</h2>
            <p className="mt-2 flex-1 text-base leading-relaxed text-muted-foreground">{c.body}</p>
            <Link
              to={c.to}
              className="mt-5 inline-flex items-center gap-1.5 text-base font-bold text-primary underline-offset-4 hover:underline"
            >
              {c.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-14 rounded-2xl border border-border bg-card p-6 md:p-10">
        <h2 className="text-2xl font-bold tracking-normal">Standards</h2>
        <ul className="mt-4 space-y-2.5 text-base leading-relaxed text-muted-foreground">
          <li>REST over HTTPS. JSON in and out. Versioned at /api/v1.</li>
          <li>Cursor pagination by default, offset pagination when you need it.</li>
          <li>Scoped API keys with a default rate limit of 60 requests per minute.</li>
          <li>Signed webhooks for post.published, post.updated, post.deleted, subscriber.confirmed, and media.processed.</li>
        </ul>
        <p className="mt-4 text-base text-muted-foreground">
          The machine-readable spec lives at{" "}
          <a href="/api/v1/openapi.json" className="font-bold text-primary underline-offset-4 hover:underline">
            /api/v1/openapi.json
          </a>
          .
        </p>
      </section>
    </div>
  );
}
