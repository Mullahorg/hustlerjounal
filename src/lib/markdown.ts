import { resolveCover } from "./covers";
/*
 * Minimal, strictly escaping Markdown renderer.
 *
 * Security rule from the spec: never trust renderer input. Every text token is
 * HTML-escaped before it is emitted, and only the block/inline structures below
 * are recognized. No raw HTML passes through. This is the allowlist.
 */

export type RenderOptions = {
  /** Base URL used to resolve root-relative internal links for heading anchors. */
  slugPrefix?: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

const CALLOUT_TITLES: Record<string, string> = {
  info: "Good to know",
  warning: "Be careful",
  success: "Done right",
  tip: "Tip",
};

function safeHref(href: string): string {
  const trimmed = href.trim();
  if (/[\\\u0000-\u0020]/.test(trimmed) || trimmed.startsWith("//")) return "#";
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed)) return escapeHtml(trimmed);
  return "#";
}

type Inline = { text: string; href?: string; strong?: boolean; em?: boolean; code?: boolean };

function parseInline(raw: string): Inline[] {
  const out: Inline[] = [];
  let rest = raw;
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/;

  while (rest.length) {
    const match = pattern.exec(rest);
    if (!match) {
      out.push({ text: rest });
      break;
    }
    if (match.index > 0) out.push({ text: rest.slice(0, match.index) });
    if ((match[1] ?? "") !== undefined) {
      out.push({ text: (match[1] ?? ""), href: (match[2] ?? "") });
    } else if (match[3] !== undefined) {
      out.push({ text: match[3], strong: true });
    } else if (match[4] !== undefined) {
      out.push({ text: match[4], em: true });
    } else if (match[5] !== undefined) {
      out.push({ text: match[5], code: true });
    }
    rest = rest.slice(match.index + match[0].length);
  }
  return out;
}

function renderInline(raw: string): string {
  return parseInline(raw)
    .map((seg) => {
      const s = seg;
      const text = escapeHtml(s.text);
      if (s.href !== undefined) {
        return `<a href="${safeHref(s.href)}">${text}</a>`;
      }
      if (s.code) return `<code>${text}</code>`;
      const wrapped = s.strong ? `<strong>${text}</strong>` : s.em ? `<em>${text}</em>` : text;
      return wrapped;
    })
    .join("");
}

export type Heading = { id: string; text: string; level: 2 | 3 };

export function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings: Heading[] = [];
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const match = /^(##|###)\s+(.*)$/.exec(line);
    if (!match) continue;
    const text = (match[2] ?? "").replace(/[*`]/g, "").trim();
    headings.push({ id: slugify(text), text, level: (match[1] ?? "").length === 2 ? 2 : 3 });
  }
  return headings;
}

/** Renders markdown to sanitized HTML. Unsupported raw HTML is escaped away. */
export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;

  const flushParagraph = (buf: string[]) => {
    if (buf.length) html.push(`<p>${renderInline(buf.join(" "))}</p>`);
  };

  while (i < lines.length) {
    const line = (lines[i] ?? "");

    // Fenced code block
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
        code.push((lines[i] ?? ""));
        i++;
      }
      i++;
      html.push(
        `<pre><code data-lang="${escapeHtml(lang || "text")}">${escapeHtml(code.join("\n"))}</code></pre>`,
      );
      continue;
    }

    // Heading
    const headingMatch = /^(#{1,4})\s+(.*)$/.exec(line);
    if (headingMatch) {
      const level = (headingMatch[1] ?? "").length;
      const text = (headingMatch[2] ?? "");
      const id = slugify(text);
      const inner = renderInline(text);
      if (level === 1) {
        html.push(`<h2 id="${id}">${inner}</h2>`);
      } else if (level === 2 || level === 3) {
        html.push(`<h${level} id="${id}">${inner}<a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a></h${level}>`);
      } else {
        html.push(`<h4>${inner}</h4>`);
      }
      i++;
      continue;
    }

    // Callout block: > [!INFO] style, or ::: callouts
    const calloutMatch = /^:::(info|warning|success|tip)\s*(.*)$/.exec(line.trim());
    if (calloutMatch) {
      const kind = (calloutMatch[1] ?? "");
      const body: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith(":::")) {
        body.push((lines[i] ?? ""));
        i++;
      }
      i++;
      html.push(
        `<div class="callout callout-${kind}"><p class="callout-title">${escapeHtml(
          CALLOUT_TITLES[kind] ?? kind,
        )}</p><p>${renderInline(body.join(" ").trim())}</p></div>`,
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && (lines[i] ?? "").startsWith("> ")) {
        quote.push((lines[i] ?? "").slice(2));
        i++;
      }
      html.push(`<blockquote><p>${renderInline(quote.join(" "))}</p></blockquote>`);
      continue;
    }

    // Table: | a | b |\n| --- | --- |\n rows
    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test((lines[i + 1] ?? ""))) {
      const splitRow = (row: string) =>
        row
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim());
      const headers = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\|.*\|\s*$/.test((lines[i] ?? ""))) {
        rows.push(splitRow((lines[i] ?? "")));
        i++;
      }
      html.push(
        `<table><thead><tr>${headers
          .map((h) => `<th>${renderInline(h)}</th>`)
          .join("")}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${renderInline(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table>`,
      );
      continue;
    }

    // Image with optional caption: ![alt|caption](url)
    const imageMatch = /^!\[([^|\]]+)(?:\|([^\]]*))?\]\(([^)]+)\)\s*$/.exec(line.trim());
    if (imageMatch) {
      const alt = escapeHtml((imageMatch[1] ?? "").trim());
      const caption = imageMatch[2] ? escapeHtml(imageMatch[2].trim()) : "";
      const url = safeHref(resolveCover(imageMatch[3] ?? "") ?? "");
      html.push(
        `<figure class="image-figure"><img src="${url}" alt="${alt}" loading="lazy" />${
          caption ? `<figcaption>${caption}</figcaption>` : ""
        }</figure>`,
      );
      i++;
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test((lines[i] ?? ""))) {
        items.push((lines[i] ?? "").replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      html.push(`<ul>${items.map((it) => `<li>${renderInline(it)}</li>`).join("")}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test((lines[i] ?? ""))) {
        items.push((lines[i] ?? "").replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      html.push(`<ol>${items.map((it) => `<li>${renderInline(it)}</li>`).join("")}</ol>`);
      continue;
    }

    // Horizontal rule
    if (/^\s*---+\s*$/.test(line)) {
      html.push("<hr />");
      i++;
      continue;
    }

    // Blank line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Paragraph
    const para: string[] = [];
    while (
      i < lines.length &&
      (lines[i] ?? "").trim() &&
      !/^(#{1,4}\s|>|```|\s*[-*]\s|\s*\d+[.)]\s|\||:::|!\[)/.test((lines[i] ?? ""))
    ) {
      para.push((lines[i] ?? "").trim());
      i++;
    }
    if (!para.length) { para.push(line); i++; }
    flushParagraph(para);
  }

  return html.join("\n");
}

export function estimateReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
