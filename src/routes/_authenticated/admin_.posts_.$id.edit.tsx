import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { adminGetPost, adminListCategories } from "@/lib/server/admin.functions";
import { AdminShell } from "@/components/admin/admin-shell";
import { EMPTY_POST, PostEditor, type EditablePost } from "@/components/admin/post-editor";

export const Route = createFileRoute("/_authenticated/admin_/posts_/$id/edit")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Edit post | Hustler Journal" }, {name:"description",content:"Edit post on Hustler Journal."}, {property:"og:title",content:"Edit post | Hustler Journal"}, {property:"og:description",content:"Edit post on Hustler Journal."}, {property:"og:type",content:"website"}, {name:"twitter:card",content:"summary_large_image"}, { name: "robots", content: "noindex" }] }),
  component: EditPostPage,
});

function EditPostPage() {
  const { id } = Route.useParams();
  const fetchPost = useServerFn(adminGetPost);
  const fetchCategories = useServerFn(adminListCategories);
  const [state, setState] = useState<{
    post: EditablePost | null;
    categories: { id: string; name: string }[];
    revisions: { id: string; title: string | null; created_at: string }[];
    forbidden: boolean;
  } | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([fetchPost({ data: { id } }), fetchCategories()]).then(([res, cats]) => {
      if (!active) return;
      const p = res.forbidden ? null : res.post;
      setState({
        post: p
          ? {
              id: p.id,
              title: p.title,
              slug: p.slug,
              subtitle: p.subtitle ?? "",
              excerpt: p.excerpt ?? "",
              body_markdown: p.body_markdown ?? "",
              type: p.type,
              category_id: p.category_id,
              cover_image_url: p.cover_image_url,
              cover_image_alt: p.cover_image_alt,
              seo_title: p.seo_title,
              seo_description: p.seo_description,
              featured: p.featured,
              editors_pick: p.editors_pick,
              status: p.status,
              scheduled_for: p.scheduled_for,
            }
          : null,
        categories: cats.map((c) => ({ id: c.id, name: c.name })),
        revisions: p ? p.revisions : [],
        forbidden: res.forbidden,
      });
    });
    return () => {
      active = false;
    };
  }, [id, fetchPost, fetchCategories]);

  return (
    <AdminShell>
      {!state ? (
        <div className="h-96 rounded-2xl bg-muted" aria-busy />
      ) : state.forbidden || !state.post ? (
        <p className="text-base text-muted-foreground">
          This post does not exist, or your role cannot edit it.
        </p>
      ) : (
        <PostEditor initial={state.post} categories={state.categories} revisions={state.revisions} />
      )}
    </AdminShell>
  );
}
