import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { updateProfile } from "@/lib/server/account.functions";

export const Route = createFileRoute("/_authenticated/account/settings")({
  head: () => ({
    meta: [{ title: "Settings | Hustler Journal" }, { name: "robots", content: "noindex" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      setEmail(data.user.email ?? "");
      const meta = data.user.user_metadata as { display_name?: string } | null;
      setName(meta?.display_name ?? "");
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/account" className="hover:text-foreground">
          Account
        </Link>{" "}
        / <span className="font-medium text-foreground">Settings</span>
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Settings</h1>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}</p>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const result = await updateProfile({ data: { displayName: name } });
            setBusy(false);
            if (result.ok) toast.success("Profile updated.");
            else toast.error(result.error ?? "Could not update your profile.");
          }}
        >
          <label htmlFor="st-name" className="sr-only">
            Display name
          </label>
          <input
            id="st-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-base"
          />
          <button
            type="submit"
            disabled={busy}
            className="h-12 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            Save name
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">Change password</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (newPassword.length < 10) {
              toast.error("Choose a password of at least 10 characters.");
              return;
            }
            setBusy(true);
            const { error } = await supabase.auth.updateUser({
              password: newPassword,
              current_password: currentPassword,
            });
            setBusy(false);
            if (error) {
              toast.error(error.message);
              return;
            }
            toast.success("Password changed.");
            setCurrentPassword("");
            setNewPassword("");
          }}
        >
          <div>
            <label htmlFor="st-current" className="mb-1.5 block text-sm font-semibold">
              Current password
            </label>
            <input
              id="st-current"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
            />
          </div>
          <div>
            <label htmlFor="st-new" className="mb-1.5 block text-sm font-semibold">
              New password
            </label>
            <input
              id="st-new"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
            />
            <p className="mt-1 text-xs text-muted-foreground">At least 10 characters.</p>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="h-12 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            Change password
          </button>
        </form>
      </section>
    </div>
  );
}
