export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          session_id: string | null
          speeltuin_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          session_id?: string | null
          speeltuin_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          session_id?: string | null
          speeltuin_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_speeltuin_id_fkey"
            columns: ["speeltuin_id"]
            isOneToOne: false
            referencedRelation: "speeltuinen"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      speeltuinen: {
        Row: {
          afbeelding_url: string | null
          badge: string | null
          bouwjaar: number | null
          created_at: string
          extra_buurtinitiatief: boolean | null
          extra_educatief: boolean | null
          extra_kunstwerk_thema: boolean | null
          extra_waterpomp: boolean | null
          fixi_copy_tekst: string | null
          fotos: Json | null
          geschikt_kinderen: boolean | null
          geschikt_kleuters: boolean | null
          geschikt_peuters: boolean | null
          grootte: Database["public"]["Enums"]["speeltuin_grootte"] | null
          heeft_bankjes: boolean | null
          heeft_basketbalveld: boolean | null
          heeft_duikelrek: boolean | null
          heeft_glijbaan: boolean | null
          heeft_horeca: boolean | null
          heeft_kabelbaan: boolean | null
          heeft_klimtoestel: boolean | null
          heeft_parkeerplaats: boolean | null
          heeft_schaduw: boolean | null
          heeft_schommel: boolean | null
          heeft_skatebaan: boolean | null
          heeft_sportveld: boolean | null
          heeft_toilet: boolean | null
          heeft_trapveld: boolean | null
          heeft_water_pomp: boolean | null
          heeft_wipwap: boolean | null
          heeft_zandbak: boolean | null
          id: string
          is_omheind: boolean | null
          is_rolstoeltoegankelijk: boolean | null
          latitude: number | null
          leeftijd_0_2_jaar: boolean | null
          leeftijd_12_plus_jaar: boolean | null
          leeftijd_2_6_jaar: boolean | null
          leeftijd_6_12_jaar: boolean | null
          ligging_bij_school: boolean | null
          ligging_bos_natuur: boolean | null
          ligging_fietspad: boolean | null
          ligging_parkeerplaats: boolean | null
          ligging_woonwijk: boolean | null
          longitude: number | null
          naam: string
          omschrijving: string | null
          ondergrond_gras: boolean | null
          ondergrond_kunstgras: boolean | null
          ondergrond_rubber: boolean | null
          ondergrond_tegels: boolean | null
          ondergrond_zand: boolean | null
          ouders_horeca_buurt: boolean | null
          ouders_picknicktafels: boolean | null
          ouders_wc_buurt: boolean | null
          speeltoestellen_voor_beperking: boolean | null
          toegang_zichtbaar_omheind: boolean | null
          toegang_zonder_drempel: boolean | null
          toegevoegd_door: string | null
          type_buurtspeeltuin: boolean | null
          type_natuurspeeltuin: boolean | null
          type_schoolplein: boolean | null
          type_speelbos: boolean | null
          updated_at: string
          veiligheid_in_zicht_huizen: boolean | null
          veiligheid_rustige_ligging: boolean | null
          veiligheid_verkeersluw: boolean | null
        }
        Insert: {
          afbeelding_url?: string | null
          badge?: string | null
          bouwjaar?: number | null
          created_at?: string
          extra_buurtinitiatief?: boolean | null
          extra_educatief?: boolean | null
          extra_kunstwerk_thema?: boolean | null
          extra_waterpomp?: boolean | null
          fixi_copy_tekst?: string | null
          fotos?: Json | null
          geschikt_kinderen?: boolean | null
          geschikt_kleuters?: boolean | null
          geschikt_peuters?: boolean | null
          grootte?: Database["public"]["Enums"]["speeltuin_grootte"] | null
          heeft_bankjes?: boolean | null
          heeft_basketbalveld?: boolean | null
          heeft_duikelrek?: boolean | null
          heeft_glijbaan?: boolean | null
          heeft_horeca?: boolean | null
          heeft_kabelbaan?: boolean | null
          heeft_klimtoestel?: boolean | null
          heeft_parkeerplaats?: boolean | null
          heeft_schaduw?: boolean | null
          heeft_schommel?: boolean | null
          heeft_skatebaan?: boolean | null
          heeft_sportveld?: boolean | null
          heeft_toilet?: boolean | null
          heeft_trapveld?: boolean | null
          heeft_water_pomp?: boolean | null
          heeft_wipwap?: boolean | null
          heeft_zandbak?: boolean | null
          id?: string
          is_omheind?: boolean | null
          is_rolstoeltoegankelijk?: boolean | null
          latitude?: number | null
          leeftijd_0_2_jaar?: boolean | null
          leeftijd_12_plus_jaar?: boolean | null
          leeftijd_2_6_jaar?: boolean | null
          leeftijd_6_12_jaar?: boolean | null
          ligging_bij_school?: boolean | null
          ligging_bos_natuur?: boolean | null
          ligging_fietspad?: boolean | null
          ligging_parkeerplaats?: boolean | null
          ligging_woonwijk?: boolean | null
          longitude?: number | null
          naam: string
          omschrijving?: string | null
          ondergrond_gras?: boolean | null
          ondergrond_kunstgras?: boolean | null
          ondergrond_rubber?: boolean | null
          ondergrond_tegels?: boolean | null
          ondergrond_zand?: boolean | null
          ouders_horeca_buurt?: boolean | null
          ouders_picknicktafels?: boolean | null
          ouders_wc_buurt?: boolean | null
          speeltoestellen_voor_beperking?: boolean | null
          toegang_zichtbaar_omheind?: boolean | null
          toegang_zonder_drempel?: boolean | null
          toegevoegd_door?: string | null
          type_buurtspeeltuin?: boolean | null
          type_natuurspeeltuin?: boolean | null
          type_schoolplein?: boolean | null
          type_speelbos?: boolean | null
          updated_at?: string
          veiligheid_in_zicht_huizen?: boolean | null
          veiligheid_rustige_ligging?: boolean | null
          veiligheid_verkeersluw?: boolean | null
        }
        Update: {
          afbeelding_url?: string | null
          badge?: string | null
          bouwjaar?: number | null
          created_at?: string
          extra_buurtinitiatief?: boolean | null
          extra_educatief?: boolean | null
          extra_kunstwerk_thema?: boolean | null
          extra_waterpomp?: boolean | null
          fixi_copy_tekst?: string | null
          fotos?: Json | null
          geschikt_kinderen?: boolean | null
          geschikt_kleuters?: boolean | null
          geschikt_peuters?: boolean | null
          grootte?: Database["public"]["Enums"]["speeltuin_grootte"] | null
          heeft_bankjes?: boolean | null
          heeft_basketbalveld?: boolean | null
          heeft_duikelrek?: boolean | null
          heeft_glijbaan?: boolean | null
          heeft_horeca?: boolean | null
          heeft_kabelbaan?: boolean | null
          heeft_klimtoestel?: boolean | null
          heeft_parkeerplaats?: boolean | null
          heeft_schaduw?: boolean | null
          heeft_schommel?: boolean | null
          heeft_skatebaan?: boolean | null
          heeft_sportveld?: boolean | null
          heeft_toilet?: boolean | null
          heeft_trapveld?: boolean | null
          heeft_water_pomp?: boolean | null
          heeft_wipwap?: boolean | null
          heeft_zandbak?: boolean | null
          id?: string
          is_omheind?: boolean | null
          is_rolstoeltoegankelijk?: boolean | null
          latitude?: number | null
          leeftijd_0_2_jaar?: boolean | null
          leeftijd_12_plus_jaar?: boolean | null
          leeftijd_2_6_jaar?: boolean | null
          leeftijd_6_12_jaar?: boolean | null
          ligging_bij_school?: boolean | null
          ligging_bos_natuur?: boolean | null
          ligging_fietspad?: boolean | null
          ligging_parkeerplaats?: boolean | null
          ligging_woonwijk?: boolean | null
          longitude?: number | null
          naam?: string
          omschrijving?: string | null
          ondergrond_gras?: boolean | null
          ondergrond_kunstgras?: boolean | null
          ondergrond_rubber?: boolean | null
          ondergrond_tegels?: boolean | null
          ondergrond_zand?: boolean | null
          ouders_horeca_buurt?: boolean | null
          ouders_picknicktafels?: boolean | null
          ouders_wc_buurt?: boolean | null
          speeltoestellen_voor_beperking?: boolean | null
          toegang_zichtbaar_omheind?: boolean | null
          toegang_zonder_drempel?: boolean | null
          toegevoegd_door?: string | null
          type_buurtspeeltuin?: boolean | null
          type_natuurspeeltuin?: boolean | null
          type_schoolplein?: boolean | null
          type_speelbos?: boolean | null
          updated_at?: string
          veiligheid_in_zicht_huizen?: boolean | null
          veiligheid_rustige_ligging?: boolean | null
          veiligheid_verkeersluw?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      daily_stats: {
        Row: {
          date: string | null
          filter_uses: number | null
          page_views: number | null
          speeltuin_views: number | null
          unique_visitors: number | null
        }
        Relationships: []
      }
      popular_speeltuinen: {
        Row: {
          naam: string | null
          view_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      invite_user_secure: {
        Args: {
          user_email: string
          user_role?: Database["public"]["Enums"]["app_role"]
        }
        Returns: Json
      }
      validate_role_change: {
        Args: {
          target_user_id: string
          new_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      speeltuin_grootte: "klein" | "middel" | "groot"
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
      app_role: ["admin", "user"],
      speeltuin_grootte: ["klein", "middel", "groot"],
    },
  },
} as const
