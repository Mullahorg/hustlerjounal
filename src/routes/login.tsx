import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | Hustler Journal" },
      { name: "description", content: "Sign in to save articles and manage your reading." },
      { property: "og:title", content: "Sign in | Hustler Journal" },
      { property: "og:description", content: "Sign in to save articles and manage your reading." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Sign in to save articles to your reading list and manage your newsletter preferences.
      </p>
      <form
        className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          setBusy(false);
          if (error) {
            toast.error(error.message);
            return;
          }
          navigate({ to: "/account" });
        }}
      >
        <div>
          <label htmlFor="lg-email" className="mb-1.5 block text-sm font-semibold">
            Email address
          </label>
          <input
            id="lg-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
          />
        </div>
        <div>
          <label htmlFor="lg-password" className="mb-1.5 block text-sm font-semibold">
            Password
          </label>
          <input
            id="lg-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          Sign in
        </button>
        <p aria-live="polite" className="text-center text-sm text-muted-foreground">
          <Link to="/forgot-password" className="font-semibold text-primary underline-offset-4 hover:underline">
            Forgot your password?
          </Link>
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/register" className="font-bold text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
