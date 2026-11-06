import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account_/subscriptions")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [{ title: "Newsletter preferences | Hustler Journal" }, {name:"description",content:"Newsletter preferences on Hustler Journal."}, {property:"og:title",content:"Newsletter preferences | Hustler Journal"}, {property:"og:description",content:"Newsletter preferences on Hustler Journal."}, {property:"og:type",content:"website"}, {name:"twitter:card",content:"summary_large_image"}, { name: "robots", content: "noindex" }],
  }),
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-base text-muted-foreground">
        <Link to="/account" className="hover:text-foreground">
          Account
        </Link>{" "}
        / <span className="font-medium text-foreground">Newsletter</span>
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold tracking-normal md:text-4xl">Newsletter preferences</h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        The weekly Hustle Brief arrives once a week with the top five stories and what shipped.
      </p>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">Your current preferences</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          Category preferences are chosen when you confirm your subscription. If you subscribed with
          a different email address, manage it from the confirmation email. Unsubscribing is one
          click from any email, and we honour it immediately.
        </p>
        <p className="mt-4 text-base">
          <Link
            to="/newsletter"
            className="font-bold text-primary underline-offset-4 hover:underline"
          >
            Subscribe or review the full newsletter terms
          </Link>
        </p>
      </section>
    </div>
  );
}
