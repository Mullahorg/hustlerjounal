import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
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
    ],
  }),
  component: ContactPage,
});

const REASONS = ["Correction request", "Story tip", "API key request", "Partnership", "Something else"];

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">Talk to the newsroom</h1>
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
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            We read everything and reply within five working days. For anything urgent about a live
            job, use the HustlerLink app so support can see your job chat.
          </p>
        </div>
      ) : (
        <form
          className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Thanks. The newsroom will get back to you.");
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ct-name" className="mb-1.5 block text-sm font-semibold">
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
              <label htmlFor="ct-email" className="mb-1.5 block text-sm font-semibold">
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
            <label htmlFor="ct-reason" className="mb-1.5 block text-sm font-semibold">
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
            <label htmlFor="ct-message" className="mb-1.5 block text-sm font-semibold">
              Message
            </label>
            <textarea
              id="ct-message"
              name="message"
              required
              rows={6}
              className="w-full rounded-xl border border-input bg-background p-4 text-base"
            />
          </div>
          <button
            type="submit"
            className="h-12 rounded-xl bg-primary px-6 text-base font-bold text-primary-foreground hover:bg-primary/90"
          >
            Send message
          </button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            This form sends your message to the editorial inbox. For account or payment issues on
            the platform itself, contact HustlerLink support from the app.
          </p>
        </form>
      )}
    </div>
  );
}
