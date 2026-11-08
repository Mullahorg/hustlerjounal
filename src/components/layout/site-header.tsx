import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { primaryNav, ecosystemNav, SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

function SigninState() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") setSignedIn(true);
      if (event === "SIGNED_OUT") setSignedIn(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return signedIn ? (
    <Link
      to="/account"
      className="inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-base font-semibold text-foreground transition-colors hover:bg-accent-soft"
    >
      My account
    </Link>
  ) : (
    <Link
      to="/login"
      className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Sign in
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <BookOpen className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
          <span className="text-lg font-extrabold tracking-normal">
            Hustler <span className="text-primary">Journal</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 xl:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-base font-semibold text-foreground transition-colors hover:bg-accent-soft"
              activeProps={{ className: "bg-primary-soft text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/search"
            aria-label="Search the Journal"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent-soft"
          >
            <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
          </Link>
          <div className="hidden sm:block">
            <SigninState />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="hidden h-10 items-center rounded-full border border-border bg-card px-4 text-base font-semibold text-foreground transition-colors hover:bg-accent-soft md:inline-flex"
              >
                Ecosystem
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {ecosystemNav.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <a href={item.to} className="cursor-pointer">
                    {item.label}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card xl:hidden"
              >
                <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto p-0">
              <div className="border-b border-border p-4">
                <SheetTitle className="text-base font-extrabold tracking-normal">
                  Hustler Journal
                </SheetTitle>
              </div>
              <nav aria-label="Mobile" className="flex flex-col p-3">
                {primaryNav.map((item) => (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate({ to: item.to });
                    }}
                    className="rounded-lg px-3 py-3 text-left text-base font-semibold text-foreground hover:bg-accent-soft"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="mt-2 border-t border-border pt-3">
                  <p className="eyebrow px-3 pb-2">The HustlerLink ecosystem</p>
                  {ecosystemNav.map((item) => (
                    <a
                      key={item.to}
                      href={item.to}
                      className="block rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-accent-soft hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="border-t border-border p-3">
                  <SigninState />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
