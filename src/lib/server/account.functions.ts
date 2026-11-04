import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listBookmarks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookmarks")
      .select(
        "created_at, post:posts(id,type,slug,title,subtitle,excerpt,cover_image_url,cover_image_alt,reading_time_minutes,published_at,updated_at,featured,editors_pick,category:categories(name,slug))",
      )
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? [])
      .map((row) => {
        const post = row.post as Record<string, unknown> | null;
        if (!post) return null;
        return {
          postId: post.id as string,
          slug: post.slug as string,
          type: post.type as string,
          title: post.title as string,
          excerpt: post.excerpt as string | null,
          coverImageUrl: post.cover_image_url as string | null,
          readingTimeMinutes: post.reading_time_minutes as number,
          publishedAt: post.published_at as string | null,
          categoryName: (post.category as { name?: string } | null)?.name ?? null,
          savedAt: row.created_at as string,
        };
      })
      .filter((b): b is NonNullable<typeof b> => b !== null);
  });

export const toggleBookmark = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: post } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", data.slug)
      .eq("status", "published")
      .limit(1);
    const postId = post?.[0]?.id;
    if (!postId) return { ok: false, bookmarked: false, error: "Article not found." };

    const { data: existing } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .limit(1);

    if (existing?.[0]) {
      const { error } = await supabase.from("bookmarks").delete().eq("post_id", postId).eq("user_id", userId);
      if (error) return { ok: false, bookmarked: true, error: error.message };
      return { ok: true, bookmarked: false };
    }
    const { error } = await supabase.from("bookmarks").insert({ user_id: userId, post_id: postId });
    if (error) return { ok: false, bookmarked: false, error: error.message };
    return { ok: true, bookmarked: true };
  });

export const getBookmarkState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: post } = await context.supabase
      .from("posts")
      .select("id")
      .eq("slug", data.slug)
      .eq("status", "published")
      .limit(1);
    const postId = post?.[0]?.id;
    if (!postId) return { bookmarked: false };
  const { data: rows } = await context.supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", context.userId)
      .eq("post_id", postId)
      .limit(1);
    return { bookmarked: Boolean(rows?.[0]) };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { displayName: string }) => input)
  .handler(async ({ data, context }) => {
    const name = data.displayName.trim().slice(0, 80);
    const { error } = await context.supabase
      .from("profiles")
      .update({ display_name: name, updated_at: new Date().toISOString() })
      .eq("id", context.userId);
    if (error) return { ok: false, error: error.message };
    if (name) {
      await context.supabase.auth.updateUser({ data: { display_name: name } });
    }
    return { ok: true };
  });
