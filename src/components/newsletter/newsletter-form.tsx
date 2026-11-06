import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/server/content.functions";
import { Loader2 } from "lucide-react";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const submit = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<{ status: "idle" | "busy" | "done" | "error"; message?: string }>({
    status: "idle",
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setState({ status: "busy" });
        const result = await submit({ data: { email, name } });
        if (result.ok) {
          setState({
            status: "done",
            message: "Subscription request received.",
          });
          setEmail("");
          setName("");
        } else {
          setState({ status: "error", message: result.error ?? "Could not subscribe. Try again." });
        }
      }}
      className="w-full"
    >
      <div className={`flex flex-col gap-3 ${compact ? "" : "sm:flex-row"}`}>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="nl-email">
            Email address
          </label>
          <input
            id="nl-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 flex-1 rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground"
          />
          {!compact && (
            <>
              <label className="sr-only" htmlFor="nl-name">
                Your name
              </label>
              <input
                id="nl-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-12 flex-1 rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground"
              />
            </>
          )}
        </div>
        <button
          type="submit"
          disabled={state.status === "busy"}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {state.status === "busy" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : "Subscribe"}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 text-base leading-relaxed text-muted-foreground">
        {state.status === "error" ? (
          <span className="font-semibold text-destructive">{state.message}</span>
        ) : state.status === "done" ? (
          <span className="font-semibold text-primary">{state.message}</span>
        ) : (
          "Double opt-in. One email a week. Unsubscribe with a single click."
        )}
      </p>
    </form>
  );
}
