import { corsHeaders, paginationFromURL, safeSearchQuery } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { createJournalPublicClient } from "@/lib/server/supabase-public";

export const Route = createFileRoute("/api/v1/categories")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      OPTIONS: () => new Response(null,{status:204,headers:corsHeaders}),
      GET: async () => {
        const client = createJournalPublicClient();
        const { data, error } = await client
          .from("categories")
          .select("id,name,slug,description")
          .is("deleted_at", null)
          .order("sort_order");
        if (error) {
          return Response.json({ error: { code: "server_error", message: error.message } }, { status: 500 });
        }
        return Response.json({ data: data ?? [] });
      },
    },
  },
});
