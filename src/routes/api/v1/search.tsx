import { corsHeaders, paginationFromURL, safeSearchQuery } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { createJournalPublicClient } from "@/lib/server/supabase-public";

export const Route = createFileRoute("/api/v1/search")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      OPTIONS: () => new Response(null,{status:204,headers:corsHeaders}),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
        if (!q) {
          return Response.json({ data: [], error: { code: "validation", message: "Pass a q parameter." } }, { status: 400 });
        }
        const client = createJournalPublicClient();
        const { data, error } = await client
          .from("posts")
          .select("id,type,slug,title,excerpt,published_at")
          .eq("status", "published")
          .lte("published_at", new Date().toISOString())
          .is("deleted_at", null)
          .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,subtitle.ilike.%${q}%`)
          .order("published_at", { ascending: false })
          .limit(20);
        if (error) {
          return Response.json({ error: { code: "server_error", message: error.message } }, { status: 500 });
        }
        return Response.json({ data: data ?? [] });
      },
    },
  },
});
