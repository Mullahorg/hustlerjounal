import { corsHeaders, paginationFromURL, safeSearchQuery } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { createJournalPublicClient } from "@/lib/server/supabase-public";

/* REST v1: list published posts. Public read, no key required. */
export const Route = createFileRoute("/api/v1/posts")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      OPTIONS: () => new Response(null,{status:204,headers:corsHeaders}),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const pagination=paginationFromURL(url);
        if(!pagination.success) return Response.json({error:{code:"invalid_query",message:"Use a limit from 1 to 50 and a nonnegative integer offset."}},{status:400,headers:corsHeaders});
        const {limit,offset}=pagination.data;
        const category = url.searchParams.get("category");

        const client = createJournalPublicClient();
        let query = client
          .from("posts")
          .select(
            "id,type,slug,title,subtitle,excerpt,cover_image_url,reading_time_minutes,published_at,updated_at,category:categories!inner(name,slug),author:authors(name,slug)",
          )
          .eq("status", "published")
          .is("deleted_at", null)
          .lte("published_at", new Date().toISOString())
          .order("published_at", { ascending: false })
          .range(offset, offset + limit - 1);
        if (category) query = query.eq("category.slug", category);

        const { data, error } = await query;
        if (error) {
          return Response.json({ error: { code: "server_error", message: error.message } }, { status: 500 });
        }
        const rows = data ?? [];
        return Response.json({
          data: rows.map((r) => {
            const cat = Array.isArray(r.category) ? r.category[0] : r.category;
            const auth = Array.isArray(r.author) ? r.author[0] : r.author;
            return {
              id: r.id,
              type: r.type,
              slug: r.slug,
              title: r.title,
              subtitle: r.subtitle,
              excerpt: r.excerpt,
              cover_image_url: r.cover_image_url,
              reading_time_minutes: r.reading_time_minutes,
              published_at: r.published_at,
              updated_at: r.updated_at,
              category: cat ? { name: cat.name, slug: cat.slug } : null,
              author: auth ? { name: auth.name, slug: auth.slug } : null,
            };
          }),
          pagination: {
            next_cursor: rows.length === limit ? String(offset + limit) : null,
            has_more: rows.length === limit,
            offset,
            limit,
          },
        },{headers:corsHeaders});
      },
    },
  },
});
