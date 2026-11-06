import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, FileText, FolderTree, Mail, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyRole } from "@/lib/server/admin.functions";

const NAV = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Posts", to: "/admin/posts", icon: FileText },
  { label: "Categories", to: "/admin/categories", icon: FolderTree },
  { label: "Newsletter", to: "/admin/newsletter", icon: Mail },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    getMyRole().then((r) => setRoles(r.roles));
  }, []);
  const isStaff = roles.some((r) =>
    ["writer", "editor", "senior_editor", "publisher", "admin", "super_admin", "moderator", "seo_manager"].includes(r),
  );

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold tracking-normal">Staff access only</h1>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          This area is for the Hustler Journal newsroom. Your account does not have an editorial
          role yet. Ask a senior editor to assign one.
        </p>
        <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground">
          Back to the Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <nav aria-label="Admin" className="sticky top-24 space-y-1 rounded-2xl border border-border bg-card p-3">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-semibold hover:bg-accent-soft"
              activeProps={{ className: "bg-primary-soft text-primary" }}
            >
              <n.icon className="h-4 w-4" aria-hidden />
              {n.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-base font-semibold text-muted-foreground hover:bg-accent-soft hover:text-foreground"
          >
            Sign out
          </button>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden" aria-label="Admin mobile">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-base font-semibold"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/"
            className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-base font-semibold"
          >
            <Home className="mr-1 inline h-3.5 w-3.5" aria-hidden />
            Site
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
