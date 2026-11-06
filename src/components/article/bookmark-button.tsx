import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { toggleBookmark, getBookmarkState } from "@/lib/server/account.functions";

export function BookmarkButton({ slug }: { slug: string }) {
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session || !active) return;
      const state = await getBookmarkState({ data: { slug } });
      if (active) setBookmarked(state.bookmarked);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  const onClick = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast.error("Sign in to save articles to your reading list.");
      navigate({ to: "/login" });
      return;
    }
    const result = await toggleBookmark({ data: { slug } });
    if (!result.ok) {
      toast.error(result.error ?? "Could not update your bookmarks.");
      return;
    }
    setBookmarked(result.bookmarked);
    toast.success(result.bookmarked ? "Saved to your reading list." : "Removed from your reading list.");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={bookmarked}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-base font-semibold text-foreground transition-colors hover:bg-accent-soft"
    >
      {bookmarked ? (
        <BookmarkCheck className="h-4 w-4 text-primary" aria-hidden />
      ) : (
        <Bookmark className="h-4 w-4" aria-hidden />
      )}
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
