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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_runs: {
        Row: {
          agent_slug: string
          awaiting_approval: boolean
          created_at: string
          hours_saved: number
          id: string
          input: Json
          output: Json
          project_id: string | null
          status: string
          studio_id: string
          summary: string | null
          thinking_log: string | null
        }
        Insert: {
          agent_slug: string
          awaiting_approval?: boolean
          created_at?: string
          hours_saved?: number
          id?: string
          input?: Json
          output?: Json
          project_id?: string | null
          status?: string
          studio_id: string
          summary?: string | null
          thinking_log?: string | null
        }
        Update: {
          agent_slug?: string
          awaiting_approval?: boolean
          created_at?: string
          hours_saved?: number
          id?: string
          input?: Json
          output?: Json
          project_id?: string | null
          status?: string
          studio_id?: string
          summary?: string | null
          thinking_log?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_agent_slug_fkey"
            columns: ["agent_slug"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "agent_runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_runs_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string
          default_model: string
          description: string
          display_order: number
          id: string
          name: string
          role: string
          slug: string
        }
        Insert: {
          created_at?: string
          default_model: string
          description: string
          display_order?: number
          id?: string
          name: string
          role: string
          slug: string
        }
        Update: {
          created_at?: string
          default_model?: string
          description?: string
          display_order?: number
          id?: string
          name?: string
          role?: string
          slug?: string
        }
        Relationships: []
      }
      archive_items: {
        Row: {
          cover_url: string | null
          created_at: string
          dialogue_transcribed: boolean
          embeddings_generated: boolean
          frames_extracted: number
          id: string
          ingestion_progress: number
          size_bytes: number
          source: string | null
          studio_id: string
          title: string
          vision_tagged: boolean
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          dialogue_transcribed?: boolean
          embeddings_generated?: boolean
          frames_extracted?: number
          id?: string
          ingestion_progress?: number
          size_bytes?: number
          source?: string | null
          studio_id: string
          title: string
          vision_tagged?: boolean
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          dialogue_transcribed?: boolean
          embeddings_generated?: boolean
          frames_extracted?: number
          id?: string
          ingestion_progress?: number
          size_bytes?: number
          source?: string | null
          studio_id?: string
          title?: string
          vision_tagged?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "archive_items_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          approval_state: string
          caption: string | null
          created_at: string
          id: string
          kind: string
          metadata: Json
          preview_url: string | null
          run_id: string | null
          studio_id: string
          title: string
        }
        Insert: {
          approval_state?: string
          caption?: string | null
          created_at?: string
          id?: string
          kind: string
          metadata?: Json
          preview_url?: string | null
          run_id?: string | null
          studio_id: string
          title: string
        }
        Update: {
          approval_state?: string
          caption?: string | null
          created_at?: string
          id?: string
          kind?: string
          metadata?: Json
          preview_url?: string | null
          run_id?: string | null
          studio_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      director_dna: {
        Row: {
          blocking: string | null
          color_palette: string[]
          created_at: string
          id: string
          is_current: boolean
          is_public: boolean
          lens_preferences: string[]
          lighting: string | null
          motifs: string[]
          notes: string | null
          pacing: string | null
          studio_id: string
          version: number
        }
        Insert: {
          blocking?: string | null
          color_palette?: string[]
          created_at?: string
          id?: string
          is_current?: boolean
          is_public?: boolean
          lens_preferences?: string[]
          lighting?: string | null
          motifs?: string[]
          notes?: string | null
          pacing?: string | null
          studio_id: string
          version?: number
        }
        Update: {
          blocking?: string | null
          color_palette?: string[]
          created_at?: string
          id?: string
          is_current?: boolean
          is_public?: boolean
          lens_preferences?: string[]
          lighting?: string | null
          motifs?: string[]
          notes?: string | null
          pacing?: string | null
          studio_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "director_dna_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      directors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string | null
          web3_wallet: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
          web3_wallet?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
          web3_wallet?: string | null
        }
        Relationships: []
      }
      distribution_handoffs: {
        Row: {
          asset_id: string | null
          channel: string
          created_at: string
          destination: string | null
          id: string
          payload: Json
          status: string
          studio_id: string
        }
        Insert: {
          asset_id?: string | null
          channel: string
          created_at?: string
          destination?: string | null
          id?: string
          payload?: Json
          status?: string
          studio_id: string
        }
        Update: {
          asset_id?: string | null
          channel?: string
          created_at?: string
          destination?: string | null
          id?: string
          payload?: Json
          status?: string
          studio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "distribution_handoffs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distribution_handoffs_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      early_access: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
        }
        Relationships: []
      }
      early_access_otp_log: {
        Row: {
          created_at: string
          email_hash: string
          id: string
          ip_hash: string
        }
        Insert: {
          created_at?: string
          email_hash: string
          id?: string
          ip_hash: string
        }
        Update: {
          created_at?: string
          email_hash?: string
          id?: string
          ip_hash?: string
        }
        Relationships: []
      }
      model_routes: {
        Row: {
          agent_slug: string
          created_at: string
          fallback_model: string | null
          id: string
          model: string
          studio_id: string
        }
        Insert: {
          agent_slug: string
          created_at?: string
          fallback_model?: string | null
          id?: string
          model: string
          studio_id: string
        }
        Update: {
          agent_slug?: string
          created_at?: string
          fallback_model?: string | null
          id?: string
          model?: string
          studio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_routes_agent_slug_fkey"
            columns: ["agent_slug"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "model_routes_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      praxis_demo_runs: {
        Row: {
          created_at: string
          id: string
          ip_hash: string
          output: string | null
          prompt: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash: string
          output?: string | null
          prompt: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string
          output?: string | null
          prompt?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          cover_url: string | null
          created_at: string
          id: string
          logline: string | null
          status: string
          studio_id: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          id?: string
          logline?: string | null
          status?: string
          studio_id: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          id?: string
          logline?: string | null
          status?: string
          studio_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      runway_calls: {
        Row: {
          created_at: string
          credits_used: number
          endpoint: string
          id: string
          run_id: string | null
          status: string
          studio_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number
          endpoint: string
          id?: string
          run_id?: string | null
          status?: string
          studio_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          endpoint?: string
          id?: string
          run_id?: string | null
          status?: string
          studio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "runway_calls_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "runway_calls_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      studios: {
        Row: {
          archive_size_estimate: string | null
          cover_url: string | null
          created_at: string
          director_id: string
          founder_name: string
          id: string
          infrastructure_mode: string
          is_public: boolean
          name: string
          slug: string
          style_notes: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          archive_size_estimate?: string | null
          cover_url?: string | null
          created_at?: string
          director_id: string
          founder_name: string
          id?: string
          infrastructure_mode?: string
          is_public?: boolean
          name: string
          slug: string
          style_notes?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          archive_size_estimate?: string | null
          cover_url?: string | null
          created_at?: string
          director_id?: string
          founder_name?: string
          id?: string
          infrastructure_mode?: string
          is_public?: boolean
          name?: string
          slug?: string
          style_notes?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "studios_director_id_fkey"
            columns: ["director_id"]
            isOneToOne: false
            referencedRelation: "directors"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          confirmed: boolean
          created_at: string
          email: string
          id: string
          source: string
        }
        Insert: {
          confirmed?: boolean
          created_at?: string
          email: string
          id?: string
          source?: string
        }
        Update: {
          confirmed?: boolean
          created_at?: string
          email?: string
          id?: string
          source?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_studio: { Args: { _studio_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "director" | "admin"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["director", "admin"],
    },
  },
} as const
