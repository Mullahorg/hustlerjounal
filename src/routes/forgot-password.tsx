import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password | Hustler Journal" },
      { name: "description", content: "Request a password reset link for your Hustler Journal account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Forgot your password</h1>
      {sent ? (
        <div role="status" aria-live="polite" className="mt-8 rounded-2xl border-2 border-primary/30 bg-primary-soft p-6">
          <h2 className="text-lg font-bold text-primary">Check your email</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            If an account exists for {email}, a reset link is on its way. The link opens the page
            where you set a new password.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Enter the email on your account and we will send a reset link.
          </p>
          <form
            className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
              });
              if (error) {
                toast.error(error.message);
                return;
              }
              setSent(true);
            }}
          >
            <div>
              <label htmlFor="fp-email" className="mb-1.5 block text-sm font-semibold">
                Email address
              </label>
              <input
                id="fp-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
              />
            </div>
            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90"
            >
              Send reset link
            </button>
          </form>
        </>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-bold text-primary underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
