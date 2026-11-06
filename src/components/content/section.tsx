import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-normal md:text-3xl">{title}</h2>
      </div>
      {action && (
        <Link
          to={action.to}
          className="inline-flex shrink-0 items-center gap-1 text-base font-bold text-primary underline-offset-4 hover:underline"
        >
          {action.label}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-muted-foreground">{body}</p>
      {action && (
        <Link
          to={action.to}
          className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[16/9] w-full bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-5 w-4/5 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
