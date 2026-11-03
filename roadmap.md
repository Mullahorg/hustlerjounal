# Hustler Journal: build roadmap

Source spec: user's pasted.md (Hustler Journal editorial app for HustlerLink).
Framework constraint: TanStack Start (not Next.js per spec Section 10 alternative clause). Lovable Cloud backend.

## Phase 1. Foundation
- [x] Enable Lovable Cloud
- [ ] Design tokens (styles.css), Plus Jakarta Sans preload, base shell (header, footer, skip link)
- [ ] Email auth (login, register, reset, verify), profiles, roles, account area

## Phase 2. Content engine
- [ ] Schema migration: categories, tags, topics, series, media, posts, revisions, newsletter, redirects, audit, settings, homepage layout
- [ ] RLS policies + role checks (writer/editor/publisher/admin)
- [ ] 12 seed articles in brand voice (Section 17)

## Phase 3. Public site
- [ ] Homepage, section indexes + article pages (stories, guides, safety, updates, news, help, developers, investors, legal)
- [ ] Search, topics, categories, authors, series, newsletter, about, contact
- [ ] Markdown renderer with strict escaping, TOC, share, bookmarks
- [ ] sitemap.xml, rss.xml, robots.txt, JSON-LD

## Phase 4. Ecosystem
- [ ] Newsletter double opt-in server fn + route, bookmarks, analytics events
- [ ] Admin shell: dashboard, posts list/editor, categories, newsletter, settings, audit

## Phase 5. API and docs
- [ ] REST /api/v1 public routes, OpenAPI spec page, developer docs pages

## Phase 6. Polish
- [ ] Accessibility pass, responsive pass, final audit report to user
