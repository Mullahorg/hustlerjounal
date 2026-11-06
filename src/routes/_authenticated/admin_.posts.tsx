import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { adminListPosts } from "@/lib/server/admin.functions";
import { AdminShell } from "@/components/admin/admin-shell";
import { EmptyState } from "@/components/content/section";
import { formatDate } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin_/posts")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Admin Posts | Hustler Journal" }, { name: "description", content: "Manage admin posts on Hustler Journal." }, { property: "og:title", content: "Admin Posts | Hustler Journal" }, { property: "og:description", content: "Manage admin posts on Hustler Journal." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] }),
  validateSearch: zodValidator(z.object({ status: fallback(z.string(), "").default("") })),
  loaderDeps: ({ search: { status } }) => ({ status }),
  loader: ({ deps }) => adminListPosts({ data: { status: deps.status } }),
  component: AdminPosts,
});

const STATUS_FILTERS = ["", "draft", "in_review", "approved", "scheduled", "published", "archived"];

function AdminPosts() {
  const { status } = Route.useSearch();
  const navigate = Route.useNavigate();
  const data = Route.useLoaderData();

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-normal">Posts</h1>
        <Link
          to="/admin/posts/new"
          className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-base font-bold text-primary-foreground hover:bg-primary/90"
        >
          New post
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s || "all"}
            type="button"
            onClick={() => navigate({ to: ".", search: { status: s } })}
            className={`rounded-full border px-3 py-1.5 text-base font-bold uppercase tracking-normal ${
              (status || "") === s
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-accent-soft"
            }`}
          >
            {s ? s.replace("_", " ") : "All"}
          </button>
        ))}
      </div>

      {data.forbidden ? (
        <p className="mt-6 text-base text-muted-foreground">Staff access only.</p>
      ) : data.posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No posts match this filter"
            body="Change the filter, or start a new draft."
            action={{ label: "New post", to: "/admin/posts/new" }}
          />
        </div>
      ) : (
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {data.posts.map((p) => (
            <Link
              key={p.id}
              to="/admin/posts/$id/edit"
              params={{ id: p.id }}
              className="flex flex-col gap-1 p-4 transition-colors hover:bg-accent-soft sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{p.title || "Untitled"}</p>
                <p className="text-base text-muted-foreground">
                  {p.type} {p.published_at ? `: published ${formatDate(p.published_at)}` : ""} {p.scheduled_for ? ": scheduled" : ""}
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-2.5 py-0.5 text-base font-bold uppercase tracking-normal ${
                  p.status === "published"
                    ? "bg-primary-soft text-primary"
                    : p.status === "in_review"
                      ? "bg-accent-soft text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {p.status.replace("_", " ")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

