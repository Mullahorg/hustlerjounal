import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { adminOverview } from "@/lib/server/admin.functions";
import { AdminShell } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/_authenticated/admin")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Admin | Hustler Journal" }, {name:"description",content:"Admin on Hustler Journal."}, {property:"og:title",content:"Admin | Hustler Journal"}, {property:"og:description",content:"Admin on Hustler Journal."}, {property:"og:type",content:"website"}, {name:"twitter:card",content:"summary_large_image"}, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const fetchOverview = useServerFn(adminOverview);
  const [data, setData] = useState<Awaited<ReturnType<typeof adminOverview>> | null>(null);

  useEffect(() => {
    let active = true;
    fetchOverview().then((d) => active && setData(d));
    return () => {
      active = false;
    };
  }, [fetchOverview]);

  return (
    <AdminShell>
      <h1 className="text-2xl font-extrabold tracking-normal">Dashboard</h1>
      {!data ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3" aria-busy>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-muted" />
          ))}
        </div>
      ) : data.forbidden ? (
        <p className="mt-6 text-base text-muted-foreground">Staff access only.</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="eyebrow">Content by status</p>
              <p className="mt-2 text-3xl font-extrabold">{data.totalPosts}</p>
              <p className="text-base text-muted-foreground">
                {Object.entries(data.counts)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ") || "No posts yet"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="eyebrow">Newsletter</p>
              <p className="mt-2 text-3xl font-extrabold">{data.subscribers.confirmed}</p>
              <p className="text-base text-muted-foreground">
                confirmed, {data.subscribers.pending} awaiting confirmation
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="eyebrow">Recent activity</p>
              <ul className="mt-2 space-y-1.5">
                {data.recent.map((r) => (
                  <li key={r.id} className="truncate text-base">
                    <Link to="/admin/posts" className="font-semibold hover:underline">
                      {r.title}
                    </Link>{" "}
                    <span className="text-muted-foreground">{r.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              to="/admin/posts/new"
              className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              New post
            </Link>
            <Link
              to="/admin/posts"
              className="inline-flex h-11 items-center rounded-full border border-border bg-card px-5 text-base font-semibold hover:bg-accent-soft"
            >
              Manage posts
            </Link>
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            View counts, reading completion, and analytics dashboards wire up once enough real
            traffic has accumulated. They display honest empty states until then.
          </p>
        </>
      )}
    </AdminShell>
  );
}
