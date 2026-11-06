import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { categories, ecosystemNav, SITE } from "@/lib/site";

const columns = [
  {
    title: "Read",
    links: [
      { label: "Success stories", to: "/stories" },
      { label: "Guides", to: "/guides" },
      { label: "Safety and escrow", to: "/safety" },
      { label: "Product updates", to: "/updates" },
      { label: "Community news", to: "/news" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "FAQ", to: "/help/faq" },
      { label: "Contact", to: "/contact" },
      { label: "Newsletter", to: "/newsletter" },
      { label: "About", to: "/about" },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Developers", to: "/developers" },
      { label: "Documentation", to: "/developers/docs" },
      { label: "API reference", to: "/developers/api" },
      { label: "Investor updates", to: "/investors" },
      { label: "Topics", to: "/topics" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <span className="text-lg font-extrabold tracking-normal">
                Hustler <span className="text-primary">Journal</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
              {SITE.tagline}. Practical guides, honest stories, and open updates for Africa's
              informal economy.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow pb-3">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-base font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="eyebrow pb-3">The HustlerLink ecosystem</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {ecosystemNav.map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="text-base font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-base text-muted-foreground">
            {new Intl.DateTimeFormat("en", { year: "numeric" }).format(new Date())} HustlerLink.
            All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-4">
            {categories
              .filter((c) => c.slug === "legal-policies")
              .map(() => null)}
            <Link to="/legal" className="text-base font-medium text-muted-foreground hover:text-foreground">
              Legal and policies
            </Link>
            <Link to="/legal/terms" className="text-base font-medium text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="/legal/privacy" className="text-base font-medium text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/legal/cookies" className="text-base font-medium text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
