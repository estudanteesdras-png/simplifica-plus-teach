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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          comentario: string
          created_at: string
          id: string
          material_id: string
          nota: number
          user_id: string
        }
        Insert: {
          comentario?: string
          created_at?: string
          id?: string
          material_id: string
          nota: number
          user_id: string
        }
        Update: {
          comentario?: string
          created_at?: string
          id?: string
          material_id?: string
          nota?: number
          user_id?: string
        }
        Relationships: []
      }
      curadoria: {
        Row: {
          material_id: string
          selo: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          material_id: string
          selo?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          material_id?: string
          selo?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      curtidas: {
        Row: {
          created_at: string
          material_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          material_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          material_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "curtidas_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
        ]
      }
      downloads: {
        Row: {
          material_id: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          material_id: string
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          material_id?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          adaptacao: string | null
          created_at: string
          disciplina: string | null
          formato: string | null
          id: string
          material_id: string | null
          nota: number | null
          serie: string | null
          tipo: string
          titulo: string | null
          user_id: string
        }
        Insert: {
          adaptacao?: string | null
          created_at?: string
          disciplina?: string | null
          formato?: string | null
          id?: string
          material_id?: string | null
          nota?: number | null
          serie?: string | null
          tipo: string
          titulo?: string | null
          user_id: string
        }
        Update: {
          adaptacao?: string | null
          created_at?: string
          disciplina?: string | null
          formato?: string | null
          id?: string
          material_id?: string | null
          nota?: number | null
          serie?: string | null
          tipo?: string
          titulo?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favoritos: {
        Row: {
          created_at: string
          material_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          material_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          material_id?: string
          user_id?: string
        }
        Relationships: []
      }
      materiais: {
        Row: {
          created_at: string
          disciplina: string
          id: string
          origem: string
          payload: Json
          publicado: boolean
          removido: boolean
          serie: string
          titulo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          disciplina?: string
          id?: string
          origem?: string
          payload: Json
          publicado?: boolean
          removido?: boolean
          serie?: string
          titulo?: string
          user_id: string
        }
        Update: {
          created_at?: string
          disciplina?: string
          id?: string
          origem?: string
          payload?: Json
          publicado?: boolean
          removido?: boolean
          serie?: string
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          disciplina: string
          email: string | null
          escola: string
          id: string
          inclusao: boolean
          materias: string[]
          nome: string
          objetivo: string
          onboarding_ok: boolean
          preferencias: string
          tema: string
          tipo_escola: string
          turma: string
          turmas: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          disciplina?: string
          email?: string | null
          escola?: string
          id: string
          inclusao?: boolean
          materias?: string[]
          nome?: string
          objetivo?: string
          onboarding_ok?: boolean
          preferencias?: string
          tema?: string
          tipo_escola?: string
          turma?: string
          turmas?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          disciplina?: string
          email?: string | null
          escola?: string
          id?: string
          inclusao?: boolean
          materias?: string[]
          nome?: string
          objetivo?: string
          onboarding_ok?: boolean
          preferencias?: string
          tema?: string
          tipo_escola?: string
          turma?: string
          turmas?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      reportes: {
        Row: {
          created_at: string
          id: string
          material_id: string
          motivo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          material_id: string
          motivo?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          material_id?: string
          motivo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reportes_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
        ]
      }
      salvos: {
        Row: {
          created_at: string
          material_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          material_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          material_id?: string
          user_id?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      is_admin: { Args: never; Returns: boolean }
      registrar_download: { Args: { _material_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
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
    },
  },
} as const
