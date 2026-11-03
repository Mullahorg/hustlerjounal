export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          diff: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_hash: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_hash?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_hash?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          role_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          role_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          role_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color_token: string
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color_token?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color_token?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_email: string | null
          author_name: string | null
          body: string | null
          created_at: string
          id: string
          ip_hash: string | null
          parent_id: string | null
          post_id: string
          status: string
        }
        Insert: {
          author_email?: string | null
          author_name?: string | null
          body?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          parent_id?: string | null
          post_id: string
          status?: string
        }
        Update: {
          author_email?: string | null
          author_name?: string | null
          body?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          parent_id?: string | null
          post_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_layout: {
        Row: {
          config: Json
          id: string
          is_active: boolean
          section_type: string
          sort_order: number
        }
        Insert: {
          config?: Json
          id?: string
          is_active?: boolean
          section_type: string
          sort_order?: number
        }
        Update: {
          config?: Json
          id?: string
          is_active?: boolean
          section_type?: string
          sort_order?: number
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          caption: string | null
          checksum: string | null
          created_at: string
          deleted_at: string | null
          filename: string
          folder: string
          height: number | null
          id: string
          mime_type: string
          original_filename: string
          size_bytes: number | null
          storage_key: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          checksum?: string | null
          created_at?: string
          deleted_at?: string | null
          filename: string
          folder?: string
          height?: number | null
          id?: string
          mime_type: string
          original_filename: string
          size_bytes?: number | null
          storage_key: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          checksum?: string | null
          created_at?: string
          deleted_at?: string | null
          filename?: string
          folder?: string
          height?: number | null
          id?: string
          mime_type?: string
          original_filename?: string
          size_bytes?: number | null
          storage_key?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          category_preferences: string[] | null
          confirmed_at: string | null
          created_at: string
          double_optin_token: string | null
          email: string
          id: string
          locale: string
          name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category_preferences?: string[] | null
          confirmed_at?: string | null
          created_at?: string
          double_optin_token?: string | null
          email: string
          id?: string
          locale?: string
          name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category_preferences?: string[] | null
          confirmed_at?: string | null
          created_at?: string
          double_optin_token?: string | null
          email?: string
          id?: string
          locale?: string
          name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      post_revisions: {
        Row: {
          author_id: string | null
          body_json: Json | null
          body_markdown: string | null
          created_at: string
          id: string
          note: string | null
          post_id: string
          title: string | null
        }
        Insert: {
          author_id?: string | null
          body_json?: Json | null
          body_markdown?: string | null
          created_at?: string
          id?: string
          note?: string | null
          post_id: string
          title?: string | null
        }
        Update: {
          author_id?: string | null
          body_json?: Json | null
          body_markdown?: string | null
          created_at?: string
          id?: string
          note?: string | null
          post_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_revisions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_views: {
        Row: {
          post_id: string
          viewed_on: string
          views: number
        }
        Insert: {
          post_id: string
          viewed_on?: string
          views?: number
        }
        Update: {
          post_id?: string
          viewed_on?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_ids: string[] | null
          body_json: Json | null
          body_markdown: string | null
          body_rendered: string | null
          canonical_url: string | null
          category_id: string | null
          cover_image_alt: string | null
          cover_image_url: string | null
          created_at: string
          created_by_user_id: string | null
          custom_fields: Json
          deleted_at: string | null
          editors_pick: boolean
          excerpt: string | null
          featured: boolean
          id: string
          language: string
          primary_author_id: string | null
          published_at: string | null
          reading_time_minutes: number
          scheduled_for: string | null
          schema_type: string
          seo_description: string | null
          seo_title: string | null
          series_id: string | null
          series_order: number | null
          slug: string
          status: string
          subtitle: string | null
          tag_ids: string[] | null
          title: string
          topic_ids: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          author_ids?: string[] | null
          body_json?: Json | null
          body_markdown?: string | null
          body_rendered?: string | null
          canonical_url?: string | null
          category_id?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          custom_fields?: Json
          deleted_at?: string | null
          editors_pick?: boolean
          excerpt?: string | null
          featured?: boolean
          id?: string
          language?: string
          primary_author_id?: string | null
          published_at?: string | null
          reading_time_minutes?: number
          scheduled_for?: string | null
          schema_type?: string
          seo_description?: string | null
          seo_title?: string | null
          series_id?: string | null
          series_order?: number | null
          slug: string
          status?: string
          subtitle?: string | null
          tag_ids?: string[] | null
          title: string
          topic_ids?: string[] | null
          type?: string
          updated_at?: string
        }
        Update: {
          author_ids?: string[] | null
          body_json?: Json | null
          body_markdown?: string | null
          body_rendered?: string | null
          canonical_url?: string | null
          category_id?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          custom_fields?: Json
          deleted_at?: string | null
          editors_pick?: boolean
          excerpt?: string | null
          featured?: boolean
          id?: string
          language?: string
          primary_author_id?: string | null
          published_at?: string | null
          reading_time_minutes?: number
          scheduled_for?: string | null
          schema_type?: string
          seo_description?: string | null
          seo_title?: string | null
          series_id?: string | null
          series_order?: number | null
          slug?: string
          status?: string
          subtitle?: string | null
          tag_ids?: string[] | null
          title?: string
          topic_ids?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_primary_author_id_fkey"
            columns: ["primary_author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          locale: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id: string
          locale?: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          locale?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string
          from_path: string
          hits: number
          id: string
          status_code: number
          to_path: string
        }
        Insert: {
          created_at?: string
          from_path: string
          hits?: number
          id?: string
          status_code?: number
          to_path: string
        }
        Update: {
          created_at?: string
          from_path?: string
          hits?: number
          id?: string
          status_code?: number
          to_path?: string
        }
        Relationships: []
      }
      series: {
        Row: {
          cover_image_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          cover_image_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          cover_image_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          slug: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      topics: {
        Row: {
          cover_image_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          cover_image_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          cover_image_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["journal_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["journal_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["journal_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      journal_has_role: {
        Args: { _roles: string[]; _user_id: string }
        Returns: boolean
      }
      record_post_view: { Args: { _slug: string }; Returns: undefined }
    }
    Enums: {
      journal_role:
        | "reader"
        | "writer"
        | "editor"
        | "senior_editor"
        | "publisher"
        | "seo_manager"
        | "media_manager"
        | "moderator"
        | "admin"
        | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      journal_role: [
        "reader",
        "writer",
        "editor",
        "senior_editor",
        "publisher",
        "seo_manager",
        "media_manager",
        "moderator",
        "admin",
        "super_admin",
      ],
    },
  },
} as const
