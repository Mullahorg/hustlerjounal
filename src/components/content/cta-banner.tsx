import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

type Variant = "worker" | "buyer" | "safety" | "developer" | "newsletter";

const VARIANTS: Record<Variant, { eyebrow: string; title: string; body: string; cta: { label: string; to: string } }> = {
  worker: {
    eyebrow: "For workers",
    title: "Get verified. Let buyers find you.",
    body: "A verified profile with a public rate card means buyers arrive already trusting your work. Verification checks your ID and trade certificates, and it takes about two working days.",
    cta: { label: "Create your verified profile", to: "https://hustlerlink.com/verify" },
  },
  buyer: {
    eyebrow: "For buyers",
    title: "Post the job. Pay through escrow.",
    body: "Post your job with a clear brief and budget. Verified workers quote, you pick one, and your money sits in escrow until you approve the work.",
    cta: { label: "Post a job on HustlerLink", to: "https://hustlerlink.com/jobs" },
  },
  safety: {
    eyebrow: "Safety",
    title: "Every payment protected by escrow.",
    body: "Money paid on HustlerLink sits in escrow until the work is delivered. If it is not what you agreed, the dispute process sorts it out with the evidence in the job chat.",
    cta: { label: "See how escrow works", to: "/safety/how-escrow-protects-buyer-and-worker" },
  },
  developer: {
    eyebrow: "For developers",
    title: "Build on the HustlerLink API.",
    body: "Query jobs, workers, and businesses over REST. Scoped API keys, cursor pagination, and webhooks for platform events.",
    cta: { label: "Read the API reference", to: "/developers/api" },
  },
  newsletter: {
    eyebrow: "Stay in the loop",
    title: "The weekly Hustle Brief.",
    body: "One email each week: the best stories, a practical guide, and what shipped. Double opt-in, one click to leave.",
    cta: { label: "Subscribe to the newsletter", to: "/newsletter" },
  },
};

export function CtaBanner({ variant }: { variant: Variant }) {
  const v = VARIANTS[variant];
  const external = v.cta.to.startsWith("http");
  return (
    <aside className="mt-12 flex flex-col items-start gap-4 rounded-2xl border-2 border-primary/20 bg-primary-soft p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground sm:flex">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="eyebrow">{v.eyebrow}</p>
          <h3 className="mt-1 text-xl font-bold tracking-tight">{v.title}</h3>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">{v.body}</p>
        </div>
      </div>
      {external ? (
        <a
          href={v.cta.to}
          className="inline-flex h-11 shrink-0 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {v.cta.label}
        </a>
      ) : (
        <Link
          to={v.cta.to}
          className="inline-flex h-11 shrink-0 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {v.cta.label}
        </Link>
      )}
    </aside>
  );
}
