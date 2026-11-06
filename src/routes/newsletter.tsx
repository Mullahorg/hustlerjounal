import { createFileRoute } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export const Route = createFileRoute("/newsletter")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Newsletter | Hustler Journal" },
      {
        name: "description",
        content: "Subscribe to the weekly Hustle Brief. Double opt-in, one email a week, unsubscribe anytime.",
      },
      { property: "og:title", content: "Newsletter | Hustler Journal" },
      {
        property: "og:description",
        content: "Subscribe to the weekly Hustle Brief from Hustler Journal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsletterPage,
});

const PREFERENCES = [
  "Success Stories",
  "Safety and Escrow",
  "Skills and Business Tips",
  "Product Updates",
  "Community News",
  "Developer Notes",
];

function NewsletterPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <MailCheck className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-4 text-4xl font-extrabold tracking-normal md:text-5xl">The weekly Hustle Brief</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        One email each week: the best story, one practical guide, and what shipped on HustlerLink.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8">
        <NewsletterForm />
      </div>

      <section className="mt-10" aria-labelledby="prefs-heading">
        <h2 id="prefs-heading" className="text-xl font-bold tracking-normal">
          What you can expect
        </h2>
        <ul className="mt-4 space-y-2 text-base leading-relaxed text-muted-foreground">
          <li>Double opt-in. We send a confirmation email before anything else arrives.</li>
          <li>One email a week. No daily blasts, ever.</li>
          <li>Unsubscribe with a single click, any email, no questions.</li>
          <li>You choose the topics when you confirm, and can change them any time from your account.</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {PREFERENCES.map((p) => (
            <span
              key={p}
              className="rounded-full border border-border bg-card px-3 py-1 text-base font-semibold text-muted-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
