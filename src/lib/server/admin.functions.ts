import { z } from "zod";
import { canEditPost, canChangeStatus } from "@/lib/editor-rules";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { estimateReadingMinutes, renderMarkdown } from "@/lib/markdown";

const STAFF_ROLES = ["writer", "editor", "senior_editor", "publisher", "admin", "super_admin"];
const PUBLISH_ROLES = ["publisher", "admin", "super_admin"];
const APPROVE_ROLES = ["senior_editor", "publisher", "admin", "super_admin"];
const ADMIN_ROLES = ["admin", "super_admin"];

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role as string);
    return { roles };
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!(await hasAnyRole(context, STAFF_ROLES))) return { forbidden: true } as const;
    const { data: posts } = await context.supabase
      .from("posts")
      .select("id,status,title,slug,type,updated_at,published_at,created_at");
    const { data: subscribers } = await context.supabase
      .from("newsletter_subscribers")
      .select("status");
    const counts: Record<string, number> = {};
    for (const p of posts ?? []) counts[p.status] = (counts[p.status] ?? 0) + 1;
    return {
      forbidden: false as const,
      counts,
      totalPosts: posts?.length ?? 0,
      subscribers: {
        pending: (subscribers ?? []).filter((s) => s.status === "pending").length,
        confirmed: (subscribers ?? []).filter((s) => s.status === "confirmed").length,
      },
      recent: (posts ?? [])
        .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""))
        .slice(0, 6)
        .map((p) => ({ id: p.id, title: p.title, status: p.status, slug: p.slug, updatedAt: p.updated_at })),
    };
  });

async function hasAnyRole(
  context: { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string },
  roles: string[],
): Promise<boolean> {
  const { data } = await context.supabase.rpc("journal_has_role", {
    _user_id: context.userId,
    _roles: roles,
  });
  return Boolean(data);
}

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { status?: string; query?: string }) => input ?? {})
  .handler(async ({ data, context }) => {
    if (!(await hasAnyRole(context, STAFF_ROLES))) return { forbidden: true } as const;
    let query = context.supabase
      .from("posts")
      .select("id,type,status,slug,title,excerpt,featured,editors_pick,published_at,updated_at,scheduled_for")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(100);
    if (data.status) query = query.eq("status", data.status);
    if (data.query) query = query.ilike("title", `%${data.query.replace(/[%]/g, "")}%`);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return {
      forbidden: false as const,
      posts:
        rows?.map((r) => ({
          ...r,
          published_at: r.published_at as string | null,
          scheduled_for: r.scheduled_for as string | null,
        })) ?? [],
    };
  });

export const adminGetPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    if (!(await hasAnyRole(context, STAFF_ROLES))) return { forbidden: true } as const;
    const { data: rows, error } = await context.supabase
      .from("posts")
      .select("*")
      .eq("id", data.id)
      .limit(1);
    if (error) throw new Error(error.message);
    const post = rows?.[0];
    if (!post) return { forbidden: false as const, post: null };
    const { data: revisions } = await context.supabase
      .from("post_revisions")
      .select("id,title,note,created_at,author_id")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false })
      .limit(10);
    return {
      forbidden: false as const,
      post: {
        ...post,
        published_at: post.published_at as string | null,
        scheduled_for: post.scheduled_for as string | null,
        revisions: revisions ?? [],
      },
    };
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({
    id: z.string().uuid().optional(), title: z.string().trim().min(1).max(200), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(200),
    subtitle: z.string().max(300).optional(), excerpt: z.string().max(500).optional(), bodyMarkdown: z.string().max(200000).optional(),
    categoryId: z.string().uuid().nullable().optional(), type: z.enum(["article","story","guide","safety","update","announcement","news","help","doc","policy","faq"]).optional(),
    coverImageUrl: z.string().max(2000).nullable().optional(), coverImageAlt: z.string().max(300).nullable().optional(),
    seoTitle: z.string().max(200).nullable().optional(), seoDescription: z.string().max(500).nullable().optional(),
    featured: z.boolean().optional(), editorsPick: z.boolean().optional(), scheduledFor: z.string().datetime().nullable().optional()
  }))
  .handler(async ({ data, context }) => {
    const staff = await hasAnyRole(context, STAFF_ROLES);
    if (!staff) return { ok: false, error: "You do not have permission to edit posts." };

    const readingTime = estimateReadingMinutes(data.bodyMarkdown ?? "");
    const bodyRendered = renderMarkdown(data.bodyMarkdown ?? "");
    const base = {
      title: data.title.trim(),
      slug: data.slug.trim(),
      subtitle: data.subtitle?.trim() || null,
      excerpt: data.excerpt?.trim() || null,
      body_markdown: data.bodyMarkdown ?? "",
      body_rendered: bodyRendered,
      category_id: data.categoryId ?? null,
      type: data.type ?? "article",
      cover_image_url: data.coverImageUrl || null,
      cover_image_alt: data.coverImageAlt || null,
      seo_title: data.seoTitle || null,
      seo_description: data.seoDescription || null,
      featured: data.featured ?? false,
      editors_pick: data.editorsPick ?? false,
      scheduled_for: data.scheduledFor || null,
      reading_time_minutes: readingTime,
    };

    if (data.id) {
      const { data: existing, error: readError } = await context.supabase.from("posts").select("id,created_by_user_id,status,slug").eq("id",data.id).maybeSingle();
      const { data: roleRows } = await context.supabase.from("user_roles").select("role").eq("user_id",context.userId);
      if (readError || !existing || !canEditPost((roleRows??[]).map(r=>r.role),existing.created_by_user_id,context.userId,existing.status)) return { ok:false,error:"You cannot edit this post." };
      const { error } = await context.supabase.from("posts").update(base).eq("id", data.id);
      if (error) return { ok: false, error: error.message };
      const { error: revError } = await context.supabase.from("post_revisions").insert({
        post_id: data.id,
        title: base.title,
        body_markdown: base.body_markdown,
        note: "Autosaved edit",
        author_id: context.userId,
      });
      if (revError) console.error("revision insert failed", revError);
      return { ok: true, id: data.id };
    }

    const { data: created, error } = await context.supabase
      .from("posts")
      .insert({ ...base, status: "draft", created_by_user_id: context.userId })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: created.id };
  });

export const adminSetStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id:z.string().uuid(),status:z.enum(["draft","in_review","approved","scheduled","published","archived"]), scheduledFor:z.string().datetime().optional() }))
  .handler(async ({ data, context }) => {
    const { data: post,error: readError } = await context.supabase.from("posts").select("id,created_by_user_id,status").eq("id",data.id).maybeSingle();
    const { data: roleRows,error: roleError } = await context.supabase.from("user_roles").select("role").eq("user_id",context.userId);
    if(readError || roleError || !post || !canChangeStatus((roleRows??[]).map(r=>r.role),post.created_by_user_id,context.userId,post.status,data.status)) return {ok:false,error:"You do not have permission for this status change."};
    if(data.status === "scheduled" && (!data.scheduledFor || new Date(data.scheduledFor).getTime()<=Date.now())) return {ok:false,error:"Choose a future publication date."};
    const patch = { status:data.status, ...(data.status === "published"?{published_at:new Date().toISOString()}:{}), ...(data.status === "scheduled"?{scheduled_for:data.scheduledFor}: {}) };
    const {data: changed,error}=await context.supabase.from("posts").update(patch).eq("id",data.id).select("id").maybeSingle();
    if(error || !changed) return {ok:false,error:"Could not change the post status."};
    return {ok:true};
  });

export const adminListCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("categories")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSaveCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id:z.string().uuid().optional(),name:z.string().trim().min(1).max(100),slug:z.string().regex(/^[a-z0-9-]+$/).max(100),description:z.string().max(1000).optional() }))
  .handler(async ({ data, context }) => {
    if (!(await hasAnyRole(context, ["editor", "senior_editor", "admin", "super_admin"]))) {
      return { ok: false, error: "Only editors and admins manage categories." };
    }
    if (data.id) {
      const { error } = await context.supabase
        .from("categories")
        .update({ name: data.name, slug: data.slug, description: data.description ?? null })
        .eq("id", data.id);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }
    const { error } = await context.supabase.from("categories").insert({
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });

export const adminListSubscribers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!(await hasAnyRole(context, ADMIN_ROLES))) return { forbidden: true } as const;
    const { data, error } = await context.supabase
      .from("newsletter_subscribers")
      .select("id,email,name,status,created_at,confirmed_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { forbidden: false as const, subscribers: data ?? [] };
  });

export const adminRestoreRevision = createServerFn({method:"POST"}).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ id:z.string().uuid(),revisionId:z.string().uuid() }))
 .handler(async ({data,context})=>{
  const {data:post}=await context.supabase.from("posts").select("created_by_user_id,status").eq("id",data.id).maybeSingle();
  const {data:roles}=await context.supabase.from("user_roles").select("role").eq("user_id",context.userId);
  if(!post || !canEditPost((roles??[]).map(r=>r.role),post.created_by_user_id,context.userId,post.status)) return {ok:false,error:"You cannot restore this revision."};
  const {data:revision}=await context.supabase.from("post_revisions").select("title,body_markdown").eq("id",data.revisionId).eq("post_id",data.id).maybeSingle();
  if(!revision) return {ok:false,error:"Revision not found."};
  const {error}=await context.supabase.from("posts").update({title:revision.title??"Untitled",body_markdown:revision.body_markdown,body_rendered:renderMarkdown(revision.body_markdown??"")}).eq("id",data.id);
  return error?{ok:false,error:"Could not restore revision."}:{ok:true};
 });
export const adminListAudit = createServerFn({method:"GET"}).middleware([requireSupabaseAuth]).handler(async ({context})=>{
 if(!(await hasAnyRole(context,ADMIN_ROLES))) throw new Error("Not found");
 const {data,error}=await context.supabase.from("audit_log").select("id,action,entity_type,created_at").order("created_at",{ascending:false}).limit(100);
 if(error) throw error; return data??[];
});
export const adminGetSettings = createServerFn({method:"GET"}).middleware([requireSupabaseAuth]).handler(async ({context})=>{
 if(!(await hasAnyRole(context,ADMIN_ROLES))) throw new Error("Not found");
 const {data,error}=await context.supabase.from("site_settings").select("key,value").order("key");
 if(error) throw error; return data??[];
});
export const adminSaveSettings = createServerFn({method:"POST"}).middleware([requireSupabaseAuth])
 .inputValidator(z.object({key:z.string().regex(/^[a-z_]+$/).max(100),value:z.string().max(5000)}))
 .handler(async ({data,context})=>{
 if(!(await hasAnyRole(context,ADMIN_ROLES))) return {ok:false,error:"Only admins can change site settings."};
 const {error}=await context.supabase.from("site_settings").upsert({key:data.key,value:data.value,updated_by:context.userId,updated_at:new Date().toISOString()});
 return error?{ok:false,error:"Could not save settings."}:{ok:true};
 });
export const adminListMessages = createServerFn({method:"GET"}).middleware([requireSupabaseAuth]).handler(async ({context})=>{
 if(!(await hasAnyRole(context,ADMIN_ROLES))) throw new Error("Not found");
 const {data,error}=await context.supabase.from("contact_messages").select("id,name,email,reason,message,created_at").order("created_at",{ascending:false}).limit(100);
 if(error) throw error;return data??[];
});
