export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      beer_review_flavor_profiles: {
        Row: {
          beer_review_id: number;
          flavor_profile_id: number;
          id: number;
        };
        Insert: {
          beer_review_id: number;
          flavor_profile_id: number;
          id?: number;
        };
        Update: {
          beer_review_id?: number;
          flavor_profile_id?: number;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "beer_review_flavor_profiles_beer_review_id_fkey";
            columns: ["beer_review_id"];
            isOneToOne: false;
            referencedRelation: "beer_reviews";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "beer_review_flavor_profiles_flavor_profile_id_fkey";
            columns: ["flavor_profile_id"];
            isOneToOne: false;
            referencedRelation: "flavor_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      beer_reviews: {
        Row: {
          abv: number | null;
          beer_name: string;
          brewery: string;
          comment: string | null;
          created_at: string;
          id: number;
          location: string | null;
          photos: string[] | null;
          presentation_style: number | null;
          rating: number;
        };
        Insert: {
          abv?: number | null;
          beer_name: string;
          brewery: string;
          comment?: string | null;
          created_at?: string;
          id?: number;
          location?: string | null;
          photos?: string[] | null;
          presentation_style?: number | null;
          rating: number;
        };
        Update: {
          abv?: number | null;
          beer_name?: string;
          brewery?: string;
          comment?: string | null;
          created_at?: string;
          id?: number;
          location?: string | null;
          photos?: string[] | null;
          presentation_style?: number | null;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: "beer_reviews_presentation_style_fkey";
            columns: ["presentation_style"];
            isOneToOne: false;
            referencedRelation: "presentation_styles";
            referencedColumns: ["id"];
          },
        ];
      };
      flavor_profiles: {
        Row: {
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          description?: string | null;
          id?: number;
          name?: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      presentation_styles: {
        Row: {
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          description?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: number;
          username: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: number;
          username: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: number;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<
  Database,
  "__InternalSupabase"
>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends
    DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
    }
      ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
      : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends
    DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
    }
      ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
      : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends
    DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
    }
      ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
      : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends
    PublicCompositeTypeNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
    }
      ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
      : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
