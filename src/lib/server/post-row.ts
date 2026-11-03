/* Shape of the joined posts row used by the public content queries. */
export type PostCardRow = {
  id: string;
  type: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  reading_time_minutes: number;
  published_at: string | null;
  updated_at: string | null;
  featured: boolean;
  editors_pick: boolean;
  body_markdown?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  schema_type?: string;
  series_order?: number | null;
  category: { name: string; slug: string } | { name: string; slug: string }[] | null;
  author:
    | { name: string; slug: string; role_title: string | null; avatar_url: string | null }
    | { name: string; slug: string; role_title: string | null; avatar_url: string | null }[]
    | null;
  series?: { name: string; slug: string } | { name: string; slug: string }[] | null;
};
