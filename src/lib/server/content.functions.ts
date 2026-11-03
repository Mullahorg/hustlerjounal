import { createServerFn } from "@tanstack/react-start";
import { extractHeadings, renderMarkdown } from "@/lib/markdown";
import { createJournalPublicClient } from "@/lib/server/supabase-public";
import type { PostCardDTO, PostDetailDTO, TopicDTO, AuthorProfileDTO } from "@/lib/types";
import type { PostCardRow } from "@/lib/server/post-row";

/* Internal: shape a joined row into a card DTO. */
export function toCard(row: PostCardRow): PostCardDTO {
  const authorRow = Array.isArray(row.author) ? row.author[0] : row.author;
  const categoryRow = Array.isArray(row.category) ? row.category[0] : row.category;
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    coverImageUrl: row.cover_image_url,
    coverImageAlt: row.cover_image_alt,
    readingTimeMinutes: row.reading_time_minutes,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    featured: row.featured,
    editorsPick: row.editors_pick,
    categorySlug: categoryRow?.slug ?? null,
    categoryName: categoryRow?.name ?? null,
    author: authorRow
      ? {
          name: authorRow.name,
          slug: authorRow.slug,
          roleTitle: authorRow.role_title,
          avatarUrl: authorRow.avatar_url,
        }
      : null,
  };
}

const CARD_SELECT =
  "id,type,slug,title,subtitle,excerpt,cover_image_url,cover_image_alt,reading_time_minutes,published_at,updated_at,featured,editors_pick,category:categories(name,slug),author:authors(name,slug,role_title,avatar_url)";

const PUBLISHED_FILTER = (query: ReturnType<typeof baseQuery>) =>
  query.eq("status", "published").is("deleted_at", null).lte("published_at", new Date().toISOString());

function baseQuery(client: ReturnType<typeof createJournalPublicClient>) {
  return client.from("posts").select(CARD_SELECT);
}

export const listPublishedPosts = createServerFn({ method: "GET" })
  .inputValidator((input: {
    categorySlug?: string;
    type?: string;
    limit?: number;
    offset?: number;
    featured?: boolean;
    editorsPick?: boolean;
  }) => input ?? {})
  .handler(async ({ data }): Promise<PostCardDTO[]> => {
    const client = createJournalPublicClient();
    let query = PUBLISHED_FILTER(baseQuery(client));
    if (data.categorySlug) query = query.eq("category.slug", data.categorySlug);
    if (data.type) query = query.eq("type", data.type);
    if (data.featured) query = query.eq("featured", true);
    if (data.editorsPick) query = query.eq("editors_pick", true);
    query = query
      .order("published_at", { ascending: false })
      .range(data.offset ?? 0, (data.offset ?? 0) + (data.limit ?? 12) - 1);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows ?? []).map(toCard);
  });

export const getTrendingPosts = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number }) => input ?? {})
  .handler(async ({ data }): Promise<PostCardDTO[]> => {
    const client = createJournalPublicClient();
    const { data: rows, error } = await PUBLISHED_FILTER(baseQuery(client))
      .eq("type", "story")
      .order("published_at", { ascending: false })
      .range(0, (data.limit ?? 4) - 1);
    if (error) throw new Error(error.message);
    return (rows ?? []).map(toCard);
  });

export const getLatestUpdates = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number }) => input ?? {})
  .handler(async ({ data }): Promise<PostCardDTO[]> => {
    const client = createJournalPublicClient();
    const { data: rows, error } = await PUBLISHED_FILTER(baseQuery(client))
      .in("type", ["update", "announcement"])
      .order("published_at", { ascending: false })
      .range(0, (data.limit ?? 3) - 1);
    if (error) throw new Error(error.message);
    return (rows ?? []).map(toCard);
  });

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }): Promise<PostDetailDTO | null> => {
    const client = createJournalPublicClient();
    const { data: rows, error } = await client
      .from("posts")
      .select(
        `${CARD_SELECT},body_markdown,seo_title,seo_description,schema_type,series:series(name,slug),series_order`,
      )
      .eq("slug", data.slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .limit(1);
    if (error) throw new Error(error.message);
    const row = rows?.[0];
    if (!row) return null;
    const bodyHtml = renderMarkdown(row.body_markdown ?? "");
    const seriesRow = Array.isArray(row.series) ? row.series[0] : row.series;
    return {
      ...toCard(row),
      bodyHtml,
      headings: extractHeadings(row.body_markdown ?? ""),
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      schemaType: row.schema_type,
      seriesName: seriesRow?.name ?? null,
      seriesSlug: seriesRow?.slug ?? null,
      seriesOrder: row.series_order,
    };
  });

export const getRelatedPosts = createServerFn({ method: "GET" })
  .inputValidator((input: { categorySlug: string; excludeSlug: string; limit?: number }) => input)
  .handler(async ({ data }): Promise<PostCardDTO[]> => {
    const client = createJournalPublicClient();
    const { data: rows, error } = await PUBLISHED_FILTER(baseQuery(client))
      .eq("category.slug", data.categorySlug)
      .neq("slug", data.excludeSlug)
      .order("published_at", { ascending: false })
      .range(0, (data.limit ?? 3) - 1);
    if (error) throw new Error(error.message);
    return (rows ?? []).map(toCard);
  });

export const getPrevNextPosts = createServerFn({ method: "GET" })
  .inputValidator((input: { publishedAt: string }) => input)
  .handler(async ({ data }): Promise<{ prev: PostCardDTO | null; next: PostCardDTO | null }> => {
    const client = createJournalPublicClient();
    const prev = await PUBLISHED_FILTER(baseQuery(client))
      .gt("published_at", data.publishedAt)
      .order("published_at", { ascending: true })
      .limit(1);
    const next = await PUBLISHED_FILTER(baseQuery(client))
      .lt("published_at", data.publishedAt)
      .order("published_at", { ascending: false })
      .limit(1);
    const prevRow = Array.isArray(prev.data) ? prev.data[0] : undefined;
    const nextRow = Array.isArray(next.data) ? next.data[0] : undefined;
    return {
      prev: prevRow ? toCard(prevRow) : null,
      next: nextRow ? toCard(nextRow) : null,
    };
  });

export const searchPosts = createServerFn({ method: "GET" })
  .inputValidator((input: { query: string; limit?: number }) => input)
  .handler(async ({ data }): Promise<PostCardDTO[]> => {
    const client = createJournalPublicClient();
    const q = data.query.trim().replace(/[%,]/g, " ").trim();
    if (!q) return [];
    const { data: rows, error } = await PUBLISHED_FILTER(baseQuery(client))
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,subtitle.ilike.%${q}%`)
      .order("published_at", { ascending: false })
      .range(0, (data.limit ?? 24) - 1);
    if (error) throw new Error(error.message);
    return (rows ?? []).map(toCard);
  });

export const listAuthors = createServerFn({ method: "GET" }).handler(async (): Promise<
  AuthorProfileDTO[]
> => {
  const client = createJournalPublicClient();
  const { data, error } = await client
    .from("authors")
    .select("name,slug,role_title,avatar_url,bio")
    .is("deleted_at", null)
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((a) => ({
    name: a.name,
    slug: a.slug,
    roleTitle: a.role_title,
    avatarUrl: a.avatar_url,
    bio: a.bio,
  }));
});

export const getAuthorBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }): Promise<AuthorProfileDTO | null> => {
    const client = createJournalPublicClient();
    const { data: rows, error } = await client
      .from("authors")
      .select("name,slug,role_title,avatar_url,bio")
      .eq("slug", data.slug)
      .is("deleted_at", null)
      .limit(1);
    if (error) throw new Error(error.message);
    const row = rows?.[0];
    return row
      ? {
          name: row.name,
          slug: row.slug,
          roleTitle: row.role_title,
          avatarUrl: row.avatar_url,
          bio: row.bio,
        }
      : null;
  });

export const listPostsByAuthor = createServerFn({ method: "GET" })
  .inputValidator((input: { authorSlug: string; limit?: number }) => input)
  .handler(async ({ data }): Promise<PostCardDTO[]> => {
    const client = createJournalPublicClient();
    const { data: rows, error } = await PUBLISHED_FILTER(baseQuery(client))
      .eq("author.slug", data.authorSlug)
      .order("published_at", { ascending: false })
      .range(0, (data.limit ?? 30) - 1);
    if (error) throw new Error(error.message);
    return (rows ?? []).map(toCard);
  });

export const listTopics = createServerFn({ method: "GET" }).handler(async (): Promise<TopicDTO[]> => {
  const client = createJournalPublicClient();
  const { data, error } = await client
    .from("topics")
    .select("id,name,slug,description")
    .is("deleted_at", null)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const recordPostView = createServerFn({ method: "POST" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const client = createJournalPublicClient();
    await client.rpc("record_post_view", { _slug: data.slug });
    return { ok: true };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; name?: string; categories?: string[] }) => input)
  .handler(async ({ data }) => {
    const client = createJournalPublicClient();
    const email = data.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: "Enter a valid email address." };
    }
    const token = crypto.randomUUID();
    const { error } = await client.from("newsletter_subscribers").insert({
      email,
      name: data.name ?? null,
      status: "pending",
      double_optin_token: token,
      category_preferences: data.categories ?? [],
    });
    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "This email is already on the list. Check your inbox to confirm." };
      }
      return { ok: false, error: "Could not subscribe right now. Try again shortly." };
    }
    return { ok: true };
  });
