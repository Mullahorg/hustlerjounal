import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { adminListCategories } from "@/lib/server/admin.functions";
import { AdminShell } from "@/components/admin/admin-shell";
import { EMPTY_POST, PostEditor } from "@/components/admin/post-editor";

export const Route = createFileRoute("/_authenticated/admin/posts/new")({
  head: () => ({ meta: [{ title: "New post | Hustler Journal" }, { name: "robots", content: "noindex" }] }),
  component: NewPostPage,
});

function NewPostPage() {
  return (
    <AdminShell>
      <NewPostInner />
    </AdminShell>
  );
}

function NewPostInner() {
  const fetchCategories = useServerFn(adminListCategories);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    let active = true;
    fetchCategories().then(
      (rows) => active && setCategories(rows.map((r) => ({ id: r.id, name: r.name }))),
    );
    return () => {
      active = false;
    };
  }, [fetchCategories]);
  return <PostEditor initial={EMPTY_POST} categories={categories} revisions={[]} />;
}
