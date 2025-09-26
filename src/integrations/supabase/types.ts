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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      error_codes: {
        Row: {
          category: string
          created_at: string | null
          description: string
          error_code: string
          id: number
          severity: string
          title: string
          updated_at: string | null
          user_friendly_message: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          error_code: string
          id?: number
          severity?: string
          title: string
          updated_at?: string | null
          user_friendly_message: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          error_code?: string
          id?: number
          severity?: string
          title?: string
          updated_at?: string | null
          user_friendly_message?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          additional_data: Json | null
          created_at: string | null
          error_code: string | null
          error_message: string | null
          id: number
          ip_address: unknown | null
          page_url: string | null
          session_id: string | null
          stack_trace: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: number
          ip_address?: unknown | null
          page_url?: string | null
          session_id?: string | null
          stack_trace?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          additional_data?: Json | null
          created_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: number
          ip_address?: unknown | null
          page_url?: string | null
          session_id?: string | null
          stack_trace?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_error_code_fkey"
            columns: ["error_code"]
            isOneToOne: false
            referencedRelation: "error_codes"
            referencedColumns: ["error_code"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          speeltuin_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          speeltuin_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          speeltuin_id?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          review_id: string | null
          speeltuin_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          review_id?: string | null
          speeltuin_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          review_id?: string | null
          speeltuin_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          cons: string | null
          content: string
          created_at: string
          id: string
          is_verified: boolean | null
          pros: string | null
          rating: number
          speeltuin_id: string
          title: string
          updated_at: string
          user_id: string
          visit_date: string | null
        }
        Insert: {
          cons?: string | null
          content: string
          created_at?: string
          id?: string
          is_verified?: boolean | null
          pros?: string | null
          rating: number
          speeltuin_id: string
          title: string
          updated_at?: string
          user_id: string
          visit_date?: string | null
        }
        Update: {
          cons?: string | null
          content?: string
          created_at?: string
          id?: string
          is_verified?: boolean | null
          pros?: string | null
          rating?: number
          speeltuin_id?: string
          title?: string
          updated_at?: string
          user_id?: string
          visit_date?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      speeltuinen: {
        Row: {
          aangemaakt_op: string | null
          adres: string | null
          afbeelding_url: string | null
          badge: string | null
          badges: string[] | null
          bouwjaar: number | null
          created_at: string | null
          fixi_copy_tekst: string | null
          fotos: string[] | null
          geschikt_kinderen: boolean | null
          geschikt_kleuters: boolean | null
          geschikt_peuters: boolean | null
          grootte: string | null
          heeft_bankjes: boolean | null
          heeft_basketbalveld: boolean | null
          heeft_duikelrek: boolean | null
          heeft_glijbaan: boolean | null
          heeft_horeca: boolean | null
          heeft_kabelbaan: boolean | null
          heeft_klimtoestel: boolean | null
          heeft_panakooi: boolean | null
          heeft_parkeerplaats: boolean | null
          heeft_schaduw: boolean | null
          heeft_schommel: boolean | null
          heeft_skatebaan: boolean | null
          heeft_sportveld: boolean | null
          heeft_toilet: boolean | null
          heeft_trapveld: boolean
          heeft_water_pomp: boolean | null
          heeft_wipwap: boolean | null
          heeft_zandbak: boolean | null
          id: string
          is_omheind: boolean | null
          latitude: number
          leeftijd_0_2_jaar: boolean | null
          leeftijd_12_plus_jaar: boolean | null
          leeftijd_2_4_jaar: boolean | null
          leeftijd_2_6_jaar: boolean | null
          leeftijd_4_6_jaar: boolean | null
          leeftijd_6_12_jaar: boolean | null
          ligging_bij_school: boolean | null
          ligging_bos_natuur: boolean | null
          ligging_fietspad: boolean | null
          ligging_parkeerplaats: boolean | null
          longitude: number
          naam: string
          omschrijving: string | null
          ondergrond_gras: boolean | null
          ondergrond_kunstgras: boolean | null
          ondergrond_rubber: boolean | null
          ondergrond_tegels: boolean | null
          ondergrond_zand: boolean | null
          toegevoegd_door: string | null
          type_buurtspeeltuin: boolean
          type_natuurspeeltuin: boolean
          type_schoolplein: boolean
          type_speelbos: boolean
          updated_at: string | null
          voorzieningen: string[] | null
        }
        Insert: {
          aangemaakt_op?: string | null
          adres?: string | null
          afbeelding_url?: string | null
          badge?: string | null
          badges?: string[] | null
          bouwjaar?: number | null
          created_at?: string | null
          fixi_copy_tekst?: string | null
          fotos?: string[] | null
          geschikt_kinderen?: boolean | null
          geschikt_kleuters?: boolean | null
          geschikt_peuters?: boolean | null
          grootte?: string | null
          heeft_bankjes?: boolean | null
          heeft_basketbalveld?: boolean | null
          heeft_duikelrek?: boolean | null
          heeft_glijbaan?: boolean | null
          heeft_horeca?: boolean | null
          heeft_kabelbaan?: boolean | null
          heeft_klimtoestel?: boolean | null
          heeft_panakooi?: boolean | null
          heeft_parkeerplaats?: boolean | null
          heeft_schaduw?: boolean | null
          heeft_schommel?: boolean | null
          heeft_skatebaan?: boolean | null
          heeft_sportveld?: boolean | null
          heeft_toilet?: boolean | null
          heeft_trapveld?: boolean
          heeft_water_pomp?: boolean | null
          heeft_wipwap?: boolean | null
          heeft_zandbak?: boolean | null
          id?: string
          is_omheind?: boolean | null
          latitude: number
          leeftijd_0_2_jaar?: boolean | null
          leeftijd_12_plus_jaar?: boolean | null
          leeftijd_2_4_jaar?: boolean | null
          leeftijd_2_6_jaar?: boolean | null
          leeftijd_4_6_jaar?: boolean | null
          leeftijd_6_12_jaar?: boolean | null
          ligging_bij_school?: boolean | null
          ligging_bos_natuur?: boolean | null
          ligging_fietspad?: boolean | null
          ligging_parkeerplaats?: boolean | null
          longitude: number
          naam: string
          omschrijving?: string | null
          ondergrond_gras?: boolean | null
          ondergrond_kunstgras?: boolean | null
          ondergrond_rubber?: boolean | null
          ondergrond_tegels?: boolean | null
          ondergrond_zand?: boolean | null
          toegevoegd_door?: string | null
          type_buurtspeeltuin?: boolean
          type_natuurspeeltuin?: boolean
          type_schoolplein?: boolean
          type_speelbos?: boolean
          updated_at?: string | null
          voorzieningen?: string[] | null
        }
        Update: {
          aangemaakt_op?: string | null
          adres?: string | null
          afbeelding_url?: string | null
          badge?: string | null
          badges?: string[] | null
          bouwjaar?: number | null
          created_at?: string | null
          fixi_copy_tekst?: string | null
          fotos?: string[] | null
          geschikt_kinderen?: boolean | null
          geschikt_kleuters?: boolean | null
          geschikt_peuters?: boolean | null
          grootte?: string | null
          heeft_bankjes?: boolean | null
          heeft_basketbalveld?: boolean | null
          heeft_duikelrek?: boolean | null
          heeft_glijbaan?: boolean | null
          heeft_horeca?: boolean | null
          heeft_kabelbaan?: boolean | null
          heeft_klimtoestel?: boolean | null
          heeft_panakooi?: boolean | null
          heeft_parkeerplaats?: boolean | null
          heeft_schaduw?: boolean | null
          heeft_schommel?: boolean | null
          heeft_skatebaan?: boolean | null
          heeft_sportveld?: boolean | null
          heeft_toilet?: boolean | null
          heeft_trapveld?: boolean
          heeft_water_pomp?: boolean | null
          heeft_wipwap?: boolean | null
          heeft_zandbak?: boolean | null
          id?: string
          is_omheind?: boolean | null
          latitude?: number
          leeftijd_0_2_jaar?: boolean | null
          leeftijd_12_plus_jaar?: boolean | null
          leeftijd_2_4_jaar?: boolean | null
          leeftijd_2_6_jaar?: boolean | null
          leeftijd_4_6_jaar?: boolean | null
          leeftijd_6_12_jaar?: boolean | null
          ligging_bij_school?: boolean | null
          ligging_bos_natuur?: boolean | null
          ligging_fietspad?: boolean | null
          ligging_parkeerplaats?: boolean | null
          longitude?: number
          naam?: string
          omschrijving?: string | null
          ondergrond_gras?: boolean | null
          ondergrond_kunstgras?: boolean | null
          ondergrond_rubber?: boolean | null
          ondergrond_tegels?: boolean | null
          ondergrond_zand?: boolean | null
          toegevoegd_door?: string | null
          type_buurtspeeltuin?: boolean
          type_natuurspeeltuin?: boolean
          type_schoolplein?: boolean
          type_speelbos?: boolean
          updated_at?: string | null
          voorzieningen?: string[] | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          favorite_notifications: boolean | null
          new_speeltuin_notifications: boolean | null
          push_notifications: boolean | null
          review_notifications: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          favorite_notifications?: boolean | null
          new_speeltuin_notifications?: boolean | null
          push_notifications?: boolean | null
          review_notifications?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          favorite_notifications?: boolean | null
          new_speeltuin_notifications?: boolean | null
          push_notifications?: boolean | null
          review_notifications?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_orphaned_photos: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      find_orphaned_photos: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          size_bytes: number
          url: string
        }[]
      }
      get_anonymized_error_logs: {
        Args: { user_uuid?: string }
        Returns: {
          anonymized_data: Json
          created_at: string
          error_code: string
          error_message: string
          id: number
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_error_statistics: {
        Args: { p_days?: number }
        Returns: {
          category: string
          count: number
          error_code: string
          last_occurrence: string
          title: string
        }[]
      }
      get_security_events: {
        Args: { days_back?: number }
        Returns: {
          details: Json
          event_time: string
          event_type: string
          table_name: string
          user_id: string
        }[]
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      invite_user_secure: {
        Args: { user_email: string; user_role?: string }
        Returns: Json
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_error: {
        Args: {
          p_additional_data?: Json
          p_error_code: string
          p_error_message?: string
          p_ip_address?: unknown
          p_page_url?: string
          p_session_id?: string
          p_stack_trace?: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: number
      }
      validate_role_change: {
        Args: { new_role: string; target_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
