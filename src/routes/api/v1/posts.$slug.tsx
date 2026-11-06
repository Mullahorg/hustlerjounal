import { corsHeaders, paginationFromURL, safeSearchQuery } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { createJournalPublicClient } from "@/lib/server/supabase-public";

export const Route = createFileRoute("/api/v1/posts/$slug")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      OPTIONS: () => new Response(null,{status:204,headers:corsHeaders}),
      GET: async ({ params }) => {
        const client = createJournalPublicClient();
        const { data, error } = await client
          .from("posts")
          .select("id,type,slug,title,subtitle,excerpt,body_markdown,cover_image_url,reading_time_minutes,published_at,updated_at,category:categories(name,slug),author:authors(name,slug)")
          .eq("slug", params.slug)
          .eq("status", "published")
          .lte("published_at", new Date().toISOString())
          .is("deleted_at", null)
          .limit(1);
        if (error) {
          return Response.json({ error: { code: "server_error", message: error.message } }, { status: 500 });
        }
        const row = data?.[0];
        if (!row) {
          return Response.json({ error: { code: "not_found", message: "No post with that slug." } }, { status: 404 });
        }
        const cat = Array.isArray(row.category) ? row.category[0] : row.category;
        const auth = Array.isArray(row.author) ? row.author[0] : row.author;
        return Response.json({
          data: {
            id: row.id,
            type: row.type,
            slug: row.slug,
            title: row.title,
            subtitle: row.subtitle,
            excerpt: row.excerpt,
            body_markdown: row.body_markdown,
            cover_image_url: row.cover_image_url,
            reading_time_minutes: row.reading_time_minutes,
            published_at: row.published_at,
            updated_at: row.updated_at,
            category: cat ? { name: cat.name, slug: cat.slug } : null,
            author: auth ? { name: auth.name, slug: auth.slug } : null,
          },
        });
      },
    },
  },
});
