import type { Heading } from "@/lib/markdown";

export type AuthorDTO = {
  name: string;
  slug: string;
  roleTitle: string | null;
  avatarUrl: string | null;
};

export type PostCardDTO = {
  id: string;
  type: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  readingTimeMinutes: number;
  publishedAt: string | null;
  updatedAt: string | null;
  featured: boolean;
  editorsPick: boolean;
  categorySlug: string | null;
  categoryName: string | null;
  author: AuthorDTO | null;
};

export type PostDetailDTO = PostCardDTO & {
  bodyHtml: string;
  headings: Heading[];
  seoTitle: string | null;
  seoDescription: string | null;
  schemaType: string;
  seriesName: string | null;
  seriesSlug: string | null;
  seriesOrder: number | null;
};

export type TopicDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type AuthorProfileDTO = AuthorDTO & { bio: string | null };

export type { Heading };
