import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminListCategories, adminSaveCategory } from "@/lib/server/admin.functions";
import { AdminShell } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  head: () => ({ meta: [{ title: "Categories | Hustler Journal" }, { name: "robots", content: "noindex" }] }),
  component: AdminCategories,
});

type Category = { id: string; name: string; slug: string; description: string | null };

function AdminCategories() {
  const fetchCategories = useServerFn(adminListCategories);
  const save = useServerFn(adminSaveCategory);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<{ id?: string; name: string; slug: string; description: string }>({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    let active = true;
    fetchCategories().then((rows) => active && setCategories(rows as Category[]));
    return () => {
      active = false;
    };
  }, [fetchCategories]);

  return (
    <AdminShell>
      <h1 className="text-2xl font-extrabold tracking-tight">Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Categories are the fixed content pillars. New ones appear in the admin tools and can be
        linked from the public site once they have posts.
      </p>

      <form
        className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[1fr_1fr_1fr_auto]"
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await save({ data: { id: form.id, name: form.name, slug: form.slug, description: form.description } });
          if (!result.ok) {
            toast.error(result.error ?? "Could not save the category.");
            return;
          }
          toast.success("Category saved.");
          setForm({ name: "", slug: "", description: "" });
          setCategories(await fetchCategories());
        }}
      >
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Name"
          className="h-12 rounded-xl border border-input bg-background px-4 text-base"
          aria-label="Category name"
        />
        <input
          required
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          placeholder="Slug"
          className="h-12 rounded-xl border border-input bg-background px-4 text-base"
          aria-label="Category slug"
        />
        <input
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Description"
          className="h-12 rounded-xl border border-input bg-background px-4 text-base"
          aria-label="Category description"
        />
        <button
          type="submit"
          className="h-12 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          {form.id ? "Update" : "Add category"}
        </button>
      </form>

      <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() =>
              setForm({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? "" })
            }
            className="flex w-full items-center gap-4 p-4 text-left hover:bg-accent-soft"
          >
            <div className="min-w-0 flex-1">
              <p className="font-bold">{c.name}</p>
              <p className="truncate text-sm text-muted-foreground">/{c.slug}{c.description ? ` : ${c.description}` : ""}</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Edit</span>
          </button>
        ))}
      </div>
    </AdminShell>
  );
}
