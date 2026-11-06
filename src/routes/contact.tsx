import { useServerFn } from "@tanstack/react-start";
import { sendContactMessage } from "@/lib/server/contact.functions";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Contact | Hustler Journal" },
      {
        name: "description",
        content: "Reach the Hustler Journal newsroom: corrections, story tips, API keys, and partnership questions.",
      },
      { property: "og:title", content: "Contact | Hustler Journal" },
      {
        property: "og:description",
        content: "Reach the Hustler Journal newsroom.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const REASONS = ["Correction request", "Story tip", "API key request", "Partnership", "Something else"];

function ContactPage() {
  const submit = useServerFn(sendContactMessage);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-normal md:text-5xl">Talk to the newsroom</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        Corrections get answers, not silence. Story tips are welcome, and we confirm every story
        with the people in it before publishing.
      </p>

      {sent ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-8 rounded-2xl border-2 border-primary/30 bg-primary-soft p-6"
        >
          <h2 className="text-lg font-bold text-primary">Message received</h2>
          <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
            Your message is saved for the editorial team. For anything urgent about a live
            job, use the HustlerLink app so support can see your job chat.
          </p>
        </div>
      ) : (
        <form
          className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8"
          onSubmit={async (e) => {
            e.preventDefault();
            const form=new FormData(e.currentTarget);setBusy(true);setError("");
            try {
              const result=await submit({data:{name:String(form.get("name")),email:String(form.get("email")),reason:String(form.get("reason")),message:String(form.get("message"))}});
              if(result.ok) setSent(true); else setError(result.error??"Could not send message.");
            } catch { setError("Could not send message. Please try again."); } finally { setBusy(false); }
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ct-name" className="mb-1.5 block text-base font-semibold">
                Your name
              </label>
              <input
                id="ct-name"
                name="name"
                required
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
              />
            </div>
            <div>
              <label htmlFor="ct-email" className="mb-1.5 block text-base font-semibold">
                Email address
              </label>
              <input
                id="ct-email"
                name="email"
                type="email"
                required
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
              />
            </div>
          </div>
          <div>
            <label htmlFor="ct-reason" className="mb-1.5 block text-base font-semibold">
              What is this about
            </label>
            <select
              id="ct-reason"
              name="reason"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
            >
              {REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ct-message" className="mb-1.5 block text-base font-semibold">
              Message
            </label>
            <textarea
              id="ct-message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              className="w-full rounded-xl border border-input bg-background p-4 text-base"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="h-12 rounded-xl bg-primary px-6 text-base font-bold text-primary-foreground hover:bg-primary/90"
          >
            Send message
          </button>
          <p role="status" className="text-destructive">{error}</p>
          <p className="text-base leading-relaxed text-muted-foreground">
            This form saves your message for the editorial team. For account or payment issues on
            the platform itself, contact HustlerLink support from the app.
          </p>
        </form>
      )}
    </div>
  );
}
