import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password | Hustler Journal" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [checked, setChecked] = useState(false);

  useState(() => {
    // Recovery links land here with type=recovery in the URL hash.
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    setIsRecovery(hash.get("type") === "recovery");
    setChecked(true);
  });

  if (checked && !isRecovery) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">This link is not valid</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Request a fresh reset link from the forgot password page.
        </p>
        <button
          onClick={() => navigate({ to: "/forgot-password" })}
          className="mt-6 h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          Request a new link
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Set a new password</h1>
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
          <label htmlFor="rp-password" className="mb-1.5 block text-sm font-semibold">
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
          <p className="mt-1 text-xs text-muted-foreground">At least 10 characters.</p>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          Update password
        </button>
      </form>
    </div>
  );
}
