import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bookmark, Settings, LogOut, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getMyRole } from "@/lib/server/admin.functions";
import { updateProfile } from "@/lib/server/account.functions";

export const Route = createFileRoute("/_authenticated/account")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "My account | Hustler Journal" }, {name:"description",content:"My account on Hustler Journal."}, {property:"og:title",content:"My account | Hustler Journal"}, {property:"og:description",content:"My account on Hustler Journal."}, {property:"og:type",content:"website"}, {name:"twitter:card",content:"summary_large_image"},
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<{ email: string; name: string } | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const [{ data }, roleRes] = await Promise.all([
        supabase.auth.getUser(),
        getMyRole(),
      ]);
      if (!active || !data.user) return;
      const meta = data.user.user_metadata as { display_name?: string } | null;
      setSession({ email: data.user.email ?? "", name: meta?.display_name ?? "" });
      setName(meta?.display_name ?? "");
      setRoles(roleRes.roles);
    })();
    return () => {
      active = false;
    };
  }, []);

  const links = [
    { label: "Saved articles", to: "/account/bookmarks", icon: Bookmark, desc: "Your reading list." },
    { label: "Newsletter preferences", to: "/account/subscriptions", icon: Mail, desc: "What arrives by email." },
    { label: "Settings", to: "/account/settings", icon: Settings, desc: "Name, email, password." },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:py-14">
      <p className="eyebrow">Account</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-normal md:text-4xl">My account</h1>
      {session && (
        <p className="mt-2 text-base text-muted-foreground">Signed in as {session.email}</p>
      )}

      {roles.some((r) => r === "admin" || r === "super_admin" || r === "publisher") && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-primary/25 bg-primary-soft p-4">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
          <p className="text-base font-semibold">
            You have editorial access.{" "}
            <Link to="/admin" className="inline-flex items-center text-primary underline-offset-4 hover:underline">
              Open the admin dashboard <ArrowRight className="ml-0.5 inline h-4 w-4" aria-hidden />
            </Link>
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="rounded-2xl border border-border bg-card p-5 card-interactive"
          >
            <l.icon className="h-5 w-5 text-primary" aria-hidden />
            <p className="mt-3 font-bold">{l.label}</p>
            <p className="mt-1 text-base text-muted-foreground">{l.desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">Display name</h2>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const result = await updateProfile({ data: { displayName: name } });
            setBusy(false);
            if (result.ok) toast.success("Display name updated.");
            else toast.error(result.error ?? "Could not update your name.");
          }}
        >
          <label htmlFor="acct-name" className="sr-only">
            Display name
          </label>
          <input
            id="acct-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-base"
          />
          <button
            type="submit"
            disabled={busy}
            className="h-12 rounded-xl bg-primary px-6 text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            Save
          </button>
        </form>
      </section>

      <button
        type="button"
        onClick={async () => {
          await supabase.auth.signOut();
          toast.success("Signed out.");
          navigate({ to: "/" });
        }}
        className="mt-10 inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-base font-semibold text-foreground hover:bg-accent-soft"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        Sign out
      </button>
    </div>
  );
}
