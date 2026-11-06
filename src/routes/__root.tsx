import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-7xl font-extrabold tracking-normal text-foreground">404</h1>
      <h2 className="mt-4 text-xl font-bold">We could not find that page</h2>
      <p className="mt-2 text-base leading-relaxed text-muted-foreground">
        The page may have moved, or the link is out of date. The search page can point you at the
        right story.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/"
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Go home
        </Link>
        <Link
          to="/search"
          className="inline-flex h-11 items-center rounded-full border border-border bg-card px-5 text-base font-semibold text-foreground hover:bg-accent-soft"
        >
          Search the Journal
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-xl font-bold tracking-normal text-foreground">This page didn't load</h1>
      <p className="mt-2 text-base leading-relaxed text-muted-foreground">
        Something went wrong on our end. You can try again, or head back home.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          to="/"
          className="inline-flex h-11 items-center rounded-full border border-border bg-card px-5 text-base font-semibold text-foreground hover:bg-accent-soft"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE.name}: Practical guides and stories from HustlerLink` },
      {
        name: "description",
        content: SITE.description,
      },
      { property: "og:title", content: `${SITE.name}: Practical guides and stories from HustlerLink` },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
      { rel: "alternate", type: "application/rss+xml", title: SITE.name, href: "/rss.xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-base focus:font-semibold focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(event => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      else queryClient.clear();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
