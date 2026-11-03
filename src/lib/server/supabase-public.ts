import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/*
 * Server-side publishable client for public reads. Created inside handlers.
 * The sb_publishable_ key is opaque, not a JWT: send only the apikey header.
 */
export function createJournalPublicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
