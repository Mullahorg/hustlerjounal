import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { adminListPosts } from "@/lib/server/admin.functions";
import { AdminShell } from "@/components/admin/admin-shell";
import { EmptyState } from "@/components/content/section";
import { formatDate } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin/posts")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: typeof search.status === "string" ? search.status : "",
  }),
  loaderDeps: ({ search: { status } }) => ({ status }),
  loader: ({ deps }) => adminListPosts({ data: { status: deps.status || undefined } }),
  component: AdminPosts,
});

const STATUS_FILTERS = ["", "draft", "in_review", "approved", "scheduled", "published", "archived"];

function AdminPosts() {
  const { status } = Route.useSearch();
  const navigate = useNavigateFromSearch();
  const data = Route.useLoaderData();

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Posts</h1>
        <Link
          to="/admin/posts/new"
          className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          New post
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s || "all"}
            type="button"
            onClick={() => navigate({ search: { status: s } })}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
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
        <p className="mt-6 text-sm text-muted-foreground">Staff access only.</p>
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
                <p className="text-sm text-muted-foreground">
                  {p.type} {p.published_at ? `: published ${formatDate(p.published_at)}` : ""} {p.scheduled_for ? ": scheduled" : ""}
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
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

function useNavigateFromSearch() {
  const { useNavigate } = require("@tanstack/react-router") as typeof import("@tanstack/react-router");
  return useNavigate();
}
