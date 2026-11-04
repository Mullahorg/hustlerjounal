import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/developers/api")({
  head: () => ({
    meta: [
      { title: "API Reference v1 | Hustler Journal" },
      {
        name: "description",
        content: "The HustlerLink REST API reference: endpoints, parameters, pagination, errors, and webhooks.",
      },
      { property: "og:title", content: "API Reference v1 | Hustler Journal" },
      {
        property: "og:description",
        content: "The HustlerLink REST API reference: endpoints, parameters, pagination, errors, and webhooks.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ApiReference,
});

const ENDPOINTS = [
  { method: "GET", path: "/api/v1/posts", desc: "List published journal posts. Filter by category, tag, author, and date range." },
  { method: "GET", path: "/api/v1/posts/{slug}", desc: "Fetch one published post by slug, including rendered body." },
  { method: "GET", path: "/api/v1/categories", desc: "List content categories with descriptions." },
  { method: "GET", path: "/api/v1/search", desc: "Full text search across titles, excerpts, and subtitles." },
  { method: "GET", path: "/api/v1/openapi.json", desc: "The OpenAPI 3.1 document describing every endpoint." },
];

export function ApiReference() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:py-14">
      <p className="eyebrow">API</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">API reference, v1</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        The HustlerLink API is a REST API that speaks JSON. Public read endpoints work without a
        key. Write endpoints and higher rate limits need a scoped bearer token.
      </p>

      <section className="mt-10" aria-labelledby="endpoints-heading">
        <h2 id="endpoints-heading" className="text-2xl font-bold tracking-tight">
          Endpoints
        </h2>
        <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
          {ENDPOINTS.map((e) => (
            <div key={e.path} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-fit rounded-md bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">
                {e.method}
              </span>
              <code className="text-sm font-semibold">{e.path}</code>
              <span className="text-sm text-muted-foreground sm:ml-auto sm:max-w-sm">{e.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="auth-heading">
        <h2 id="auth-heading" className="text-2xl font-bold tracking-tight">
          Authentication and limits
        </h2>
        <div className="article-body mt-4">
          <p>
            Send your key as a bearer token. Rate limiting defaults to 60 requests per minute per
            key. Exceeded limits return HTTP 429 with a Retry-After header. Request keys through{" "}
            <a href="/contact">the contact page</a>.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">OpenAPI spec</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Import /api/v1/openapi.json into Postman, Insomnia, or any OpenAPI 3.1 client. The spec is
          generated from the same code that serves the endpoints, so it stays accurate.
        </p>
      </section>
    </div>
  );
}
