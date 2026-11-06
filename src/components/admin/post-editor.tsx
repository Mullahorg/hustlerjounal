import { RichTextEditor } from "./rich-text-editor";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Eye, Save, Send, CheckCircle2, Archive, ArrowLeft } from "lucide-react";
import { adminSavePost, adminSetStatus, getMyRole, adminRestoreRevision } from "@/lib/server/admin.functions";
import { renderMarkdown } from "@/lib/markdown";

export type EditablePost = {
  id?: string;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  body_markdown: string;
  type: string;
  category_id: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured: boolean;
  editors_pick: boolean;
  status: string;
  scheduled_for: string | null;
};

export const EMPTY_POST: EditablePost = {
  title: "",
  slug: "",
  subtitle: "",
  excerpt: "",
  body_markdown: "",
  type: "article",
  category_id: null,
  cover_image_url: null,
  cover_image_alt: null,
  seo_title: null,
  seo_description: null,
  featured: false,
  editors_pick: false,
  status: "draft",
  scheduled_for: null,
};

export function PostEditor({
  initial,
  categories,
  revisions,
}: {
  initial: EditablePost;
  categories: { id: string; name: string }[];
  revisions: { id: string; title: string | null; created_at: string; note?: string | null }[];
}) {
  const navigate = useNavigate();
  const restore = useServerFn(adminRestoreRevision);
  const [markdownMode,setMarkdownMode] = useState(false);
  const save = useServerFn(adminSavePost);
  const setStatus = useServerFn(adminSetStatus);
  const fetchRole = useServerFn(getMyRole);
  const [post, setPost] = useState<EditablePost>(initial);
  const [roles, setRoles] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const dirty = useRef(false);
  const latest = useRef(post);
  latest.current = post;

  useEffect(() => {
    fetchRole().then((r) => setRoles(r.roles));
  }, [fetchRole]);

  const canPublish = roles.some((r) => ["publisher", "admin", "super_admin"].includes(r));
  const canApprove = roles.some((r) => ["senior_editor", "publisher", "admin", "super_admin"].includes(r));
  const words = useMemo(() => post.body_markdown.trim().split(/\s+/).filter(Boolean).length, [post.body_markdown]);

  const set = (patch: Partial<EditablePost>) => {
    dirty.current = true;
    setPost((p) => ({ ...p, ...patch }));
  };

  /* Autosave every 15 seconds while dirty. */
  useEffect(() => {
    const t = setInterval(async () => {
      if (!dirty.current || !latest.current.id) return;
      dirty.current = false;
      const p = latest.current;
      const result = await save({ data: { ...toSaveInput(p), ...(p.id ? { id: p.id } : {}) } });
      if (!result.ok) toast.error(result.error ?? "Autosave failed.");
    }, 15000);
    return () => clearInterval(t);
  }, [save]);

  const doSave = async () => {
    setBusy(true);
    const result = await save({ data: { ...toSaveInput(post), ...(post.id ? { id: post.id } : {}) } });
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not save the post.");
      return;
    }
    dirty.current = false;
    toast.success("Saved.");
    if (!post.id && result.id) {
      navigate({ to: "/admin/posts/$id/edit", params: { id: result.id } });
    }
  };

  const changeStatus = async (status: "draft" | "in_review" | "approved" | "scheduled" | "published" | "archived") => {
    if (!post.id) {
      toast.error("Save the post first.");
      return;
    }
    const result = await setStatus({ data: { id: post.id, status, ...(status === "scheduled" && post.scheduled_for ? {scheduledFor:new Date(post.scheduled_for).toISOString()}: {}) } });
    if (!result.ok) {
      toast.error(result.error ?? "Could not change the status.");
      return;
    }
    setPost((p) => ({ ...p, status }));
    toast.success(
      status === "published" ? "Published. It is live on the site." : `Status set to ${status.replace("_", " ")}.`,
    );
  };

  const previewHtml = useMemo(() => renderMarkdown(post.body_markdown), [post.body_markdown]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin/posts"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All posts
          </Link>
          <h1 className="mt-2 text-2xl font-extrabold tracking-normal">
            {initial.id ? "Edit post" : "New post"}
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            Status: <span className="font-bold text-foreground">{post.status.replace("_", " ")}</span>
            {" "}{words} words. ~{Math.max(1, Math.round(words / 200))} min read.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={doSave}
            disabled={busy}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <Save className="h-4 w-4" aria-hidden />
            {initial.id ? "Save" : "Create draft"}
          </button>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-base font-semibold hover:bg-accent-soft"
          >
            <Eye className="h-4 w-4" aria-hidden />
            {preview ? "Edit" : "Preview"}
          </button>
          {post.status === "draft" && (
            <button
              type="button"
              onClick={() => changeStatus("in_review")}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-base font-semibold hover:bg-accent-soft"
            >
              <Send className="h-4 w-4" aria-hidden />
              Submit for review
            </button>
          )}
          {["in_review", "approved"].includes(post.status) && canApprove && post.status === "in_review" && (
            <button
              type="button"
              onClick={() => changeStatus("approved")}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-base font-semibold hover:bg-accent-soft"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Approve
            </button>
          )}
          {canPublish && post.status !== "published" && (
            <button
              type="button"
              onClick={() => changeStatus("published")}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-base font-bold text-accent-foreground hover:bg-accent/90"
            >
              Publish
            </button>
          )}
          {post.status === "published" && (
            <button
              type="button"
              onClick={() => changeStatus("archived")}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-base font-semibold hover:bg-accent-soft"
            >
              <Archive className="h-4 w-4" aria-hidden />
              Unpublish
            </button>
          )}
        </div>
      </div>

      {preview ? (
        <article className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h1 className="text-3xl font-extrabold tracking-normal">{post.title || "Untitled"}</h1>
          <div className="article-body mt-6" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </article>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <Field label="Title">
              <input
                value={post.title}
                onChange={(e) => set({ title: e.target.value })}
                className="h-12 w-full rounded-xl border border-input bg-card px-4 text-base font-semibold"
                required
              />
            </Field>
            <Field label="Slug" hint="Lowercase with hyphens. Changing the slug of a published post should come with a redirect.">
              <input
                value={post.slug}
                onChange={(e) => set({ slug: e.target.value })}
                className="h-12 w-full rounded-xl border border-input bg-card px-4 text-base"
              />
            </Field>
            <Field label="Subtitle">
              <input
                value={post.subtitle}
                onChange={(e) => set({ subtitle: e.target.value })}
                className="h-12 w-full rounded-xl border border-input bg-card px-4 text-base"
              />
            </Field>
            <Field label="Excerpt" hint="Up to about 160 characters. Shown on cards and in search results.">
              <textarea
                value={post.excerpt}
                onChange={(e) => set({ excerpt: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-input bg-card p-4 text-base"
              />
            </Field>
            <div className="flex items-center justify-between"><p className="font-bold">Article body</p><Button variant="outline" type="button" onClick={()=>setMarkdownMode(v=>!v)}>{markdownMode?"Rich text":"Markdown"}</Button></div>
            {markdownMode ? <Field label="Body (Markdown)">
              <textarea
                value={post.body_markdown}
                onChange={(e) => set({ body_markdown: e.target.value })}
                rows={20}
                className="w-full rounded-xl border border-input bg-card p-4 font-mono text-base leading-relaxed"
                placeholder={"## A heading\n\nShort paragraphs. Two to four sentences.\n\n:::tip\nCallouts: info, warning, success, tip.\n:::\n\n[An internal link](/guides/some-slug)"}
              />
            </Field> : <RichTextEditor value={post.body_markdown} onChange={body=>set({body_markdown:body})} />}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="eyebrow pb-3">Organisation</p>
              <div className="space-y-3">
                <label className="block text-base font-semibold">
                  Type
                  <select
                    value={post.type}
                    onChange={(e) => set({ type: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-base font-normal"
                  >
                    {["article", "story", "guide", "update", "announcement", "news", "help", "doc", "policy", "faq"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-base font-semibold">
                  Category
                  <select
                    value={post.category_id ?? ""}
                    onChange={(e) => set({ category_id: e.target.value || null })}
                    className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-base font-normal"
                  >
                    <option value="">None</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-base font-semibold">
                  <input
                    type="checkbox"
                    checked={post.featured}
                    onChange={(e) => set({ featured: e.target.checked })}
                    className="h-4 w-4"
                  />
                  Featured (homepage hero)
                </label>
                <label className="flex items-center gap-2 text-base font-semibold">
                  <input
                    type="checkbox"
                    checked={post.editors_pick}
                    onChange={(e) => set({ editors_pick: e.target.checked })}
                    className="h-4 w-4"
                  />
                  Editors' pick
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="eyebrow pb-3">Cover image</p>
              <input
                value={post.cover_image_url ?? ""}
                onChange={(e) => set({ cover_image_url: e.target.value || null })}
                placeholder="/images/cover.jpg"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
              />
              <input
                value={post.cover_image_alt ?? ""}
                onChange={(e) => set({ cover_image_alt: e.target.value || null })}
                placeholder="Alt text (required for accessibility)"
                className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
              />
              {post.cover_image_url && (
                <img src={post.cover_image_url} alt="" className="mt-3 aspect-video w-full rounded-lg object-cover" />
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="eyebrow pb-3">SEO</p>
              <input
                value={post.seo_title ?? ""}
                onChange={(e) => set({ seo_title: e.target.value || null })}
                placeholder="Meta title"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
              />
              <p className="mt-1 text-base text-muted-foreground">
                {(post.seo_title ?? "").length}/60 characters
              </p>
              <textarea
                value={post.seo_description ?? ""}
                onChange={(e) => set({ seo_description: e.target.value || null })}
                placeholder="Meta description"
                rows={3}
                className="mt-2 w-full rounded-lg border border-input bg-background p-3 text-base"
              />
              <p className="mt-1 text-base text-muted-foreground">
                {(post.seo_description ?? "").length}/155 characters
              </p>
            </div>

            {canPublish && <div className="space-y-3 border-t border-border pt-4"><label className="block font-bold">Publication date<input type="datetime-local" value={post.scheduled_for?.slice(0,16)??""} onChange={e=>set({scheduled_for:e.target.value})} className="mt-2 h-12 w-full rounded-lg border border-input bg-card px-3" /></label><Button type="button" variant="outline" disabled={!post.id || !post.scheduled_for} onClick={()=>changeStatus("scheduled")}>Schedule</Button></div>}
            {revisions.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="eyebrow pb-3">Revisions</p>
                <ul className="space-y-2">
                  {revisions.slice(0, 6).map((r) => (
                    <li key={r.id} className="text-base text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()} {r.note ? `: ${r.note}` : ""}
                      <Button variant="outline" type="button" className="ml-2" onClick={async ()=>{if(!post.id)return;const result=await restore({data:{id:post.id,revisionId:r.id}});if(result.ok){toast.success("Revision restored.");window.location.reload();}else toast.error(result.error);}}>Restore</Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function toSaveInput(p: EditablePost) {
  return {
    ...(p.id ? { ...(p.id ? { id: p.id } : {}) } : {}),
    title: p.title,
    slug: p.slug,
    subtitle: p.subtitle,
    excerpt: p.excerpt,
    bodyMarkdown: p.body_markdown,
    categoryId: p.category_id,
    type: p.type,
    coverImageUrl: p.cover_image_url,
    coverImageAlt: p.cover_image_alt,
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
    featured: p.featured,
    editorsPick: p.editors_pick,
    scheduledFor: p.scheduled_for,
  };
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-base font-bold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-base text-muted-foreground">{hint}</span>}
    </label>
  );
}
