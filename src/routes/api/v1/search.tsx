import { createFileRoute } from "@tanstack/react-router";
import { createJournalPublicClient } from "@/lib/server/supabase-public";

export const Route = createFileRoute("/api/v1/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = (url.searchParams.get("q") ?? "").trim().replace(/[%,]/g, " ").slice(0, 120);
        if (!q) {
          return Response.json({ data: [], error: { code: "validation", message: "Pass a q parameter." } }, { status: 400 });
        }
        const client = createJournalPublicClient();
        const { data, error } = await client
          .from("posts")
          .select("id,type,slug,title,excerpt,published_at")
          .eq("status", "published")
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
