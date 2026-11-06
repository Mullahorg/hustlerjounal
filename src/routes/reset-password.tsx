import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Set a new password | Hustler Journal" }, {name:"description",content:"Set a new password on Hustler Journal."}, {property:"og:title",content:"Set a new password | Hustler Journal"}, {property:"og:description",content:"Set a new password on Hustler Journal."}, {property:"og:type",content:"website"}, {name:"twitter:card",content:"summary_large_image"},
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [{ checked, isRecovery }, setRecovery] = useState({ checked: false, isRecovery: false });
  useEffect(() => {
    let active = true;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const recoveryLink = hash.get("type") === "recovery";
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && event === "PASSWORD_RECOVERY") setRecovery({ checked: true, isRecovery: Boolean(session) });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (active) setRecovery({ checked: true, isRecovery: recoveryLink && Boolean(data.session) });
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

  if (checked && !isRecovery) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold tracking-normal">This link is not valid</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Request a fresh reset link from the forgot password page.
        </p>
        <button
          onClick={() => navigate({ to: "/forgot-password" })}
          className="mt-6 h-11 rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground"
        >
          Request a new link
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-normal">Set a new password</h1>
      <form
        className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          if (password.length < 10) {
            toast.error("Choose a password of at least 10 characters.");
            return;
          }
          setBusy(true);
          const { error } = await supabase.auth.updateUser({ password });
          setBusy(false);
          if (error) {
            toast.error(error.message);
            return;
          }
          toast.success("Password updated. You are signed in.");
          navigate({ to: "/account" });
        }}
      >
        <div>
          <label htmlFor="rp-password" className="mb-1.5 block text-base font-semibold">
            New password
          </label>
          <input
            id="rp-password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
          />
          <p className="mt-1 text-base text-muted-foreground">At least 10 characters.</p>
        </div>
        <button
          type="submit"
          disabled={busy || !checked || !isRecovery}
          className="h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          Update password
        </button>
      </form>
    </div>
  );
}
