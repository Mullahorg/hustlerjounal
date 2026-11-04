import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account | Hustler Journal" },
      { name: "description", content: "Create a Hustler Journal account to save articles and manage subscriptions." },
      { property: "og:title", content: "Create account | Hustler Journal" },
      { property: "og:description", content: "Create a Hustler Journal account." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Free. It exists so you can save articles and manage your newsletter subscriptions.
      </p>
      {awaitingConfirm ? (
        <div role="status" aria-live="polite" className="mt-8 rounded-2xl border-2 border-primary/30 bg-primary-soft p-6">
          <h2 className="text-lg font-bold text-primary">Check your email</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            We sent a confirmation link to {email}. Click it to finish, then sign in.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            Go to sign in
          </button>
        </div>
      ) : (
        <form
          className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6"
          onSubmit={async (e) => {
            e.preventDefault();
            if (password.length < 10) {
              toast.error("Choose a password of at least 10 characters.");
              return;
            }
            setBusy(true);
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: window.location.origin,
                data: { display_name: displayName || undefined },
              },
            });
            setBusy(false);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data.session) {
              navigate({ to: "/account" });
              return;
            }
            setAwaitingConfirm(true);
          }}
        >
          <div>
            <label htmlFor="rg-name" className="mb-1.5 block text-sm font-semibold">
              Display name
            </label>
            <input
              id="rg-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
            />
          </div>
          <div>
            <label htmlFor="rg-email" className="mb-1.5 block text-sm font-semibold">
              Email address
            </label>
            <input
              id="rg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
            />
          </div>
          <div>
            <label htmlFor="rg-password" className="mb-1.5 block text-sm font-semibold">
              Password
            </label>
            <input
              id="rg-password"
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
            Create account
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
