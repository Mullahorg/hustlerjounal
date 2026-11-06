import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "About | Hustler Journal" },
      {
        name: "description",
        content: "Hustler Journal is the editorial home of HustlerLink: guides, stories, safety, and open updates.",
      },
      { property: "og:title", content: "About | Hustler Journal" },
      {
        property: "og:description",
        content: "Hustler Journal is the editorial home of HustlerLink.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const TEAM = [
  {
    name: "Amina Wanjiru",
    role: "Senior Editor",
    to: "/authors/amina-wanjiru",
    bio: "Leads the newsroom. Eight years covering small business and work in East Africa.",
  },
  {
    name: "David Otieno",
    role: "Staff Writer",
    to: "/authors/david-otieno",
    bio: "Writes the guides. Trained as an electrical engineer and ran his own repair shop in Kisumu.",
  },
  {
    name: "Grace Mutua",
    role: "Platform Reporter",
    to: "/authors/grace-mutua",
    bio: "Covers the platform. Interviews workers and buyers every week so we report what actually happens.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <p className="eyebrow">About</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-normal md:text-5xl">
        The publication of record for the informal economy
      </h1>
      <div className="article-body mt-8">
        <p>
          Hustler Journal is the editorial home of HustlerLink. It exists to teach, document, and
          build trust: practical guides on trades and pricing, real success stories, honest product
          updates, and a Help Center that answers questions in plain language.
        </p>
        <p>
          We hold ourselves to a few rules. Body text is never small. Fees and terms are stated
          upfront. Workers are written about as skilled professionals, never as problems to be
          solved. When we make a mistake, we correct it in public.
        </p>
        <p>
          Every article reinforces the HustlerLink mission: creating opportunities, increasing
          trust, and empowering Africa's informal economy.
        </p>
        <p>
          Read{" "}
          <a href="/news/why-we-are-building-hustler-journal">Why we are building Hustler Journal</a>{" "}
          for the full argument, or{" "}
          <Link to="/contact" className="text-primary underline">
            pitch the newsroom
          </Link>{" "}
          with a story we should cover.
        </p>
      </div>

      <section className="mt-12" aria-labelledby="team-heading">
        <h2 id="team-heading" className="text-2xl font-bold tracking-normal">
          The newsroom
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {TEAM.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="rounded-2xl border border-border bg-card p-5 card-interactive"
            >
              <p className="font-bold">{m.name}</p>
              <p className="text-base font-semibold text-muted-foreground">{m.role}</p>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{m.bio}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
