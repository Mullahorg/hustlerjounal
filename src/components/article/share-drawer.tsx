import { useState } from "react";
import { Share2, Link2, Printer, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SHARE_TARGETS = [
  { label: "WhatsApp", href: (url: string, title: string) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  { label: "X", href: (url: string, title: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
  { label: "Facebook", href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { label: "LinkedIn", href: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  { label: "SMS", href: (url: string, title: string) => `sms:?body=${encodeURIComponent(`${title} ${url}`)}` },
  { label: "Email", href: (url: string, title: string) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}` },
];

export function ShareDrawer({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent-soft"
        >
          <Share2 className="h-4 w-4" aria-hidden />
          Share
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl p-6">
        <SheetHeader>
          <SheetTitle className="text-left text-lg font-bold">Share this article</SheetTitle>
        </SheetHeader>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={copy}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-accent-soft"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
            {copied ? "Copied" : "Copy link"}
          </button>
          {SHARE_TARGETS.map((t) => (
            <a
              key={t.label}
              href={t.href(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold hover:bg-accent-soft"
            >
              {t.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-accent-soft"
          >
            <Printer className="h-4 w-4" aria-hidden />
            Print
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
