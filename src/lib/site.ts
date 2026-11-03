export const SITE = {
  name: "Hustler Journal",
  tagline: "The official publication of HustlerLink",
  description:
    "Practical guides, success stories, and product updates from HustlerLink, built for Africa's informal economy.",
  platformUrl: "https://hustlerlink.com",
  statusUrl: "https://status.hustlerlink.com",
} as const;

export type NavItem = { label: string; to: string; external?: boolean };

export const primaryNav: NavItem[] = [
  { label: "Stories", to: "/stories" },
  { label: "Guides", to: "/guides" },
  { label: "Safety & Escrow", to: "/safety" },
  { label: "Updates", to: "/updates" },
  { label: "News", to: "/news" },
  { label: "Help Center", to: "/help" },
  { label: "Developers", to: "/developers" },
];

export const ecosystemNav: NavItem[] = [
  { label: "HustlerLink Platform", to: "https://hustlerlink.com", external: true },
  { label: "Jobs", to: "https://hustlerlink.com/jobs", external: true },
  { label: "Marketplace", to: "https://hustlerlink.com/marketplace", external: true },
  { label: "Worker Directory", to: "https://hustlerlink.com/workers", external: true },
  { label: "Business Directory", to: "https://hustlerlink.com/businesses", external: true },
  { label: "Verification", to: "https://hustlerlink.com/verify", external: true },
  { label: "Status Page", to: "https://status.hustlerlink.com", external: true },
];

export type CategoryMeta = {
  slug: string;
  name: string;
  route: string;
  description: string;
};

/* The fixed content pillars from the spec, with their public routes. */
export const categories: CategoryMeta[] = [
  {
    slug: "success-stories",
    name: "Success Stories",
    route: "/stories",
    description:
      "Real hustles from across Kenya. Workers and small businesses share what changed for them.",
  },
  {
    slug: "safety-escrow",
    name: "Safety and Escrow",
    route: "/safety",
    description:
      "How escrow works, what to check before you pay, and how to stay safe on every job.",
  },
  {
    slug: "skills-business-tips",
    name: "Skills and Business Tips",
    route: "/guides",
    description:
      "Pricing, registering a business, writing job posts, and running a tighter operation.",
  },
  {
    slug: "product-updates",
    name: "Product Updates",
    route: "/updates",
    description: "What shipped on HustlerLink, and what it changes for you.",
  },
  {
    slug: "community-news",
    name: "Community News",
    route: "/news",
    description: "Meetups, partnerships, and news from the HustlerLink community.",
  },
  {
    slug: "help-center",
    name: "Help Center",
    route: "/help",
    description: "Step by step answers for buyers, workers, and businesses.",
  },
  {
    slug: "developer-documentation",
    name: "Developer Documentation",
    route: "/developers/docs",
    description: "Build on the HustlerLink platform with our APIs and tools.",
  },
  {
    slug: "api-documentation",
    name: "API Documentation",
    route: "/developers/api",
    description: "REST reference for the HustlerLink v1 API.",
  },
  {
    slug: "investor-updates",
    name: "Investor Updates",
    route: "/investors",
    description: "Numbers, milestones, and plans, shared openly.",
  },
  {
    slug: "company-announcements",
    name: "Company Announcements",
    route: "/news",
    description: "Announcements from the HustlerLink team.",
  },
  {
    slug: "legal-policies",
    name: "Legal and Policies",
    route: "/legal",
    description: "Terms, privacy, cookies, and platform policies in plain language.",
  },
  {
    slug: "knowledge-base",
    name: "Knowledge Base",
    route: "/help/faq",
    description: "Reference articles covering the whole platform.",
  },
];

export function categoryBySlug(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug);
}

export const sectionRoutes = new Set([
  "/stories",
  "/guides",
  "/safety",
  "/updates",
  "/news",
  "/help",
  "/developers",
  "/investors",
  "/legal",
]);

/* Maps a category slug to its public index route. */
export function categoryRoute(slug: string): string {
  return categoryBySlug(slug)?.route ?? "/search";
}

export function formatDate(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function readingTimeText(minutes: number): string {
  return `${minutes} min read`;
}
