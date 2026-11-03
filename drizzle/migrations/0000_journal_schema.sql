-- Hustler Journal: content engine schema
create type public.journal_role as enum (
  'reader','writer','editor','senior_editor','publisher','seo_manager',
  'media_manager','moderator','admin','super_admin'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  slug text unique,
  bio text,
  avatar_url text,
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.journal_role not null default 'reader',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.journal_has_role(_user_id uuid, _roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role::text = any(_roles)
  )
$$;

create or replace function public.has_role(_user_id uuid, _role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role::text = _role
  )
$$;

create table public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  role_title text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  color_token text not null default 'primary',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  usage_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  cover_image_id uuid,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  cover_image_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  original_filename text not null,
  storage_key text not null,
  mime_type text not null,
  size_bytes int,
  width int,
  height int,
  alt_text text,
  caption text,
  folder text not null default '/',
  checksum text,
  uploaded_by uuid,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'article',
  status text not null default 'draft'
    check (status in ('draft','in_review','approved','scheduled','published','archived')),
  slug text unique not null,
  title text not null,
  subtitle text,
  excerpt text,
  body_markdown text,
  body_rendered text,
  body_json jsonb,
  cover_image_url text,
  cover_image_alt text,
  author_ids uuid[] default '{}',
  primary_author_id uuid references public.authors(id),
  created_by_user_id uuid,
  category_id uuid references public.categories(id),
  tag_ids uuid[] default '{}',
  topic_ids uuid[] default '{}',
  series_id uuid references public.series(id),
  series_order int,
  reading_time_minutes int not null default 1,
  language text not null default 'en',
  seo_title text,
  seo_description text,
  canonical_url text,
  schema_type text not null default 'Article',
  custom_fields jsonb not null default '{}',
  featured boolean not null default false,
  editors_pick boolean not null default false,
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index posts_published_idx on public.posts (published_at desc)
  where status = 'published' and deleted_at is null;
create index posts_category_idx on public.posts (category_id)
  where status = 'published' and deleted_at is null;

create table public.post_revisions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  body_markdown text,
  body_json jsonb,
  title text,
  author_id uuid,
  note text,
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  parent_id uuid references public.comments(id),
  author_name text,
  author_email text,
  body text,
  status text not null default 'pending'
    check (status in ('pending','approved','spam','rejected')),
  ip_hash text,
  created_at timestamptz not null default now()
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','unsubscribed','bounced')),
  double_optin_token text,
  confirmed_at timestamptz,
  category_preferences text[] default '{}',
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text unique not null,
  to_path text not null,
  status_code int not null default 301 check (status_code in (301,302,410)),
  hits int not null default 0,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  diff jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid,
  updated_at timestamptz not null default now()
);

create table public.homepage_layout (
  id uuid primary key default gen_random_uuid(),
  section_type text not null,
  config jsonb not null default '{}',
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.post_views (
  post_id uuid references public.posts(id) on delete cascade not null,
  viewed_on date not null default current_date,
  views int not null default 0,
  unique (post_id, viewed_on)
);

create or replace function public.record_post_view(_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_post_id uuid;
begin
  select id into v_post_id from public.posts
  where slug = _slug and status = 'published' and deleted_at is null;
  if v_post_id is null then return; end if;
  insert into public.post_views (post_id, viewed_on, views)
  values (v_post_id, current_date, 1)
  on conflict (post_id, viewed_on) do update set views = post_views.views + 1;
end;
$$;

-- ============ GRANTS ============
grant select on public.authors, public.categories, public.tags, public.topics,
  public.series, public.site_settings, public.homepage_layout, public.redirects
  to anon, authenticated;
grant select on public.posts to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, select, update, delete on public.profiles to authenticated;
grant all on public.profiles, public.user_roles to service_role;
grant select on public.user_roles to authenticated;
grant select, insert, update, delete on public.posts, public.post_revisions to authenticated;
grant select, insert, update, delete on public.media to authenticated;
grant select, insert, update, delete on public.comments to authenticated;
grant select, insert, update, delete on public.bookmarks to authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant select, update, delete on public.newsletter_subscribers to authenticated;
grant all on public.audit_log, public.post_views to service_role;
grant select on public.post_views to authenticated;
grant select, insert on public.notifications to authenticated;
grant update on public.notifications to authenticated;
grant execute on function public.record_post_view(text) to anon, authenticated;
grant execute on function public.journal_has_role(uuid, text[]) to authenticated;
grant execute on function public.has_role(uuid, text) to authenticated;
grant insert on public.audit_log to authenticated;

-- ============ RLS ============
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.topics enable row level security;
alter table public.series enable row level security;
alter table public.media enable row level security;
alter table public.posts enable row level security;
alter table public.post_revisions enable row level security;
alter table public.comments enable row level security;
alter table public.bookmarks enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.redirects enable row level security;
alter table public.audit_log enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_layout enable row level security;
alter table public.notifications enable row level security;
alter table public.post_views enable row level security;

create policy "Public read authors" on public.authors
  for select to anon, authenticated using (deleted_at is null);
create policy "Admins manage authors" on public.authors
  for all to authenticated
  using (journal_has_role(auth.uid(), array['admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['admin','super_admin']));

create policy "Public read categories" on public.categories
  for select to anon, authenticated using (deleted_at is null);
create policy "Admins manage categories" on public.categories
  for all to authenticated
  using (journal_has_role(auth.uid(), array['editor','senior_editor','admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['editor','senior_editor','admin','super_admin']));

create policy "Public read tags" on public.tags
  for select to anon, authenticated using (deleted_at is null);
create policy "Admins manage tags" on public.tags
  for all to authenticated
  using (journal_has_role(auth.uid(), array['editor','senior_editor','admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['editor','senior_editor','admin','super_admin']));

create policy "Public read topics" on public.topics
  for select to anon, authenticated using (deleted_at is null);
create policy "Admins manage topics" on public.topics
  for all to authenticated
  using (journal_has_role(auth.uid(), array['editor','senior_editor','admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['editor','senior_editor','admin','super_admin']));

create policy "Public read series" on public.series
  for select to anon, authenticated using (deleted_at is null);
create policy "Admins manage series" on public.series
  for all to authenticated
  using (journal_has_role(auth.uid(), array['editor','senior_editor','admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['editor','senior_editor','admin','super_admin']));

create policy "Writers read media" on public.media
  for select to authenticated
  using (journal_has_role(auth.uid(), array['writer','editor','senior_editor','publisher','media_manager','seo_manager','moderator','admin','super_admin']));
create policy "Writers upload media" on public.media
  for insert to authenticated
  with check (journal_has_role(auth.uid(), array['writer','editor','senior_editor','publisher','media_manager','admin','super_admin']));
create policy "Media managers update media" on public.media
  for update to authenticated
  using (journal_has_role(auth.uid(), array['media_manager','admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['media_manager','admin','super_admin']));

create policy "Public reads published posts" on public.posts
  for select to anon, authenticated
  using (
    status = 'published' and deleted_at is null
    and (published_at is null or published_at <= now())
  );
create policy "Editorial reads all posts" on public.posts
  for select to authenticated
  using (journal_has_role(auth.uid(), array['writer','editor','senior_editor','publisher','seo_manager','moderator','admin','super_admin']));
create policy "Writers create drafts" on public.posts
  for insert to authenticated
  with check (
    journal_has_role(auth.uid(), array['writer','editor','senior_editor','publisher','admin','super_admin'])
    and created_by_user_id = auth.uid()
    and status in ('draft','in_review')
  );
create policy "Writers update own posts" on public.posts
  for update to authenticated
  using (created_by_user_id = auth.uid() and journal_has_role(auth.uid(), array['writer','editor','senior_editor','publisher','admin','super_admin']))
  with check (created_by_user_id = auth.uid());
create policy "Editors update any post" on public.posts
  for update to authenticated
  using (journal_has_role(auth.uid(), array['editor','senior_editor','admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['editor','senior_editor','admin','super_admin']));

create policy "Editorial reads revisions" on public.post_revisions
  for select to authenticated
  using (journal_has_role(auth.uid(), array['writer','editor','senior_editor','publisher','admin','super_admin']));
create policy "Writers create revisions" on public.post_revisions
  for insert to authenticated
  with check (journal_has_role(auth.uid(), array['writer','editor','senior_editor','publisher','admin','super_admin']));

create policy "Moderators read comments" on public.comments
  for select to authenticated
  using (journal_has_role(auth.uid(), array['moderator','editor','senior_editor','admin','super_admin']));
create policy "Moderators manage comments" on public.comments
  for all to authenticated
  using (journal_has_role(auth.uid(), array['moderator','admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['moderator','admin','super_admin']));

create policy "Users read own bookmarks" on public.bookmarks
  for select to authenticated using (user_id = auth.uid());
create policy "Users insert own bookmarks" on public.bookmarks
  for insert to authenticated with check (user_id = auth.uid());
create policy "Users delete own bookmarks" on public.bookmarks
  for delete to authenticated using (user_id = auth.uid());

create policy "Anyone subscribes" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);
create policy "Admins read subscribers" on public.newsletter_subscribers
  for select to authenticated
  using (journal_has_role(auth.uid(), array['admin','super_admin']));
create policy "Admins manage subscribers" on public.newsletter_subscribers
  for update to authenticated
  using (journal_has_role(auth.uid(), array['admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['admin','super_admin']));

create policy "Admins manage redirects" on public.redirects
  for all to authenticated
  using (journal_has_role(auth.uid(), array['seo_manager','admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['seo_manager','admin','super_admin']));

create policy "Admins read audit" on public.audit_log
  for select to authenticated
  using (journal_has_role(auth.uid(), array['admin','super_admin']));

create policy "Public reads settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "Admins write settings" on public.site_settings
  for all to authenticated
  using (journal_has_role(auth.uid(), array['admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['admin','super_admin']));

create policy "Public reads homepage layout" on public.homepage_layout
  for select to anon, authenticated using (is_active);
create policy "Admins manage homepage layout" on public.homepage_layout
  for all to authenticated
  using (journal_has_role(auth.uid(), array['admin','super_admin']))
  with check (journal_has_role(auth.uid(), array['admin','super_admin']));

create policy "Users read own notifications" on public.notifications
  for select to authenticated using (user_id = auth.uid());
create policy "Users update own notifications" on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Admins read views" on public.post_views
  for select to authenticated
  using (journal_has_role(auth.uid(), array['admin','super_admin','seo_manager']));

-- Profile auto-creation on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, slug)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'user-' || substr(new.id::text, 1, 8)
  )
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'reader')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
