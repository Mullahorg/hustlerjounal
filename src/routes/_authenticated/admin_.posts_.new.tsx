import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { adminListCategories } from "@/lib/server/admin.functions";
import { AdminShell } from "@/components/admin/admin-shell";
import { EMPTY_POST, PostEditor } from "@/components/admin/post-editor";

export const Route = createFileRoute("/_authenticated/admin_/posts_/new")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "New post | Hustler Journal" }, {name:"description",content:"New post on Hustler Journal."}, {property:"og:title",content:"New post | Hustler Journal"}, {property:"og:description",content:"New post on Hustler Journal."}, {property:"og:type",content:"website"}, {name:"twitter:card",content:"summary_large_image"}, { name: "robots", content: "noindex" }] }),
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
