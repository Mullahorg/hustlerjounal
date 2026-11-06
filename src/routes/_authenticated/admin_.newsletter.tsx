import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { adminListSubscribers } from "@/lib/server/admin.functions";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatDate } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin_/newsletter")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Newsletter | Hustler Journal" }, {name:"description",content:"Newsletter on Hustler Journal."}, {property:"og:title",content:"Newsletter | Hustler Journal"}, {property:"og:description",content:"Newsletter on Hustler Journal."}, {property:"og:type",content:"website"}, {name:"twitter:card",content:"summary_large_image"}, { name: "robots", content: "noindex" }] }),
  component: AdminNewsletter,
});

function AdminNewsletter() {
  const fetchSubscribers = useServerFn(adminListSubscribers);
  const [data, setData] = useState<Awaited<ReturnType<typeof adminListSubscribers>> | null>(null);

  useEffect(() => {
    let active = true;
    fetchSubscribers().then((d) => active && setData(d));
    return () => {
      active = false;
    };
  }, [fetchSubscribers]);

  return (
    <AdminShell>
      <h1 className="text-2xl font-extrabold tracking-normal">Newsletter</h1>
      {!data ? (
        <div className="mt-6 h-64 rounded-2xl bg-muted" aria-busy />
      ) : data.forbidden ? (
        <p className="mt-6 text-base text-muted-foreground">Admin access only.</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {(["confirmed", "pending", "unsubscribed"] as const).map((s) => (
              <div key={s} className="rounded-2xl border border-border bg-card p-5">
                <p className="eyebrow">{s}</p>
                <p className="mt-2 text-3xl font-extrabold">
                  {data.subscribers.filter((x) => x.status === s).length}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {data.subscribers.map((s) => (
              <div key={s.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{s.email}</p>
                  <p className="text-base text-muted-foreground">
                    {s.name ? `${s.name}, ` : ""}subscribed {formatDate(s.created_at)}
                    {s.confirmed_at ? `, confirmed ${formatDate(s.confirmed_at)}` : ""}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-2.5 py-0.5 text-base font-bold uppercase tracking-normal ${
                    s.status === "confirmed"
                      ? "bg-primary-soft text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
