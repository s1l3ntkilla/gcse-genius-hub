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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      classroom_invitations: {
        Row: {
          classroom_id: string
          created_at: string
          id: string
          invited_by: string
          message: string | null
          responded_at: string | null
          status: string
          student_id: string
        }
        Insert: {
          classroom_id: string
          created_at?: string
          id?: string
          invited_by: string
          message?: string | null
          responded_at?: string | null
          status?: string
          student_id: string
        }
        Update: {
          classroom_id?: string
          created_at?: string
          id?: string
          invited_by?: string
          message?: string | null
          responded_at?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_invitations_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_members: {
        Row: {
          classroom_id: string
          created_at: string
          id: string
          joined_at: string | null
          status: string
          student_id: string
        }
        Insert: {
          classroom_id: string
          created_at?: string
          id?: string
          joined_at?: string | null
          status?: string
          student_id: string
        }
        Update: {
          classroom_id?: string
          created_at?: string
          id?: string
          joined_at?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_members_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_questions: {
        Row: {
          anonymous: boolean | null
          answer: string | null
          answered: boolean | null
          answered_at: string | null
          answered_by: string | null
          category: string | null
          classroom_id: string
          created_at: string
          id: string
          question: string
          student_id: string
          topic: string | null
        }
        Insert: {
          anonymous?: boolean | null
          answer?: string | null
          answered?: boolean | null
          answered_at?: string | null
          answered_by?: string | null
          category?: string | null
          classroom_id: string
          created_at?: string
          id?: string
          question: string
          student_id: string
          topic?: string | null
        }
        Update: {
          anonymous?: boolean | null
          answer?: string | null
          answered?: boolean | null
          answered_at?: string | null
          answered_by?: string | null
          category?: string | null
          classroom_id?: string
          created_at?: string
          id?: string
          question?: string
          student_id?: string
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classroom_questions_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classrooms: {
        Row: {
          class_code: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          subject: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          class_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          subject: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          class_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          subject?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_chats: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          group_name: string
          group_type: Database["public"]["Enums"]["group_type"] | null
          id: string
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          group_name: string
          group_type?: Database["public"]["Enums"]["group_type"] | null
          id?: string
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          group_name?: string
          group_type?: Database["public"]["Enums"]["group_type"] | null
          id?: string
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_chats_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          is_muted: boolean | null
          joined_at: string | null
          role: Database["public"]["Enums"]["group_role"] | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          is_muted?: boolean | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["group_role"] | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          is_muted?: boolean | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["group_role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          created_at: string | null
          edited_at: string | null
          group_id: string
          id: string
          message_content: string
          message_type: Database["public"]["Enums"]["message_type"] | null
          reactions: Json | null
          read_by: string[] | null
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          edited_at?: string | null
          group_id: string
          id?: string
          message_content: string
          message_type?: Database["public"]["Enums"]["message_type"] | null
          reactions?: Json | null
          read_by?: string[] | null
          sender_id: string
        }
        Update: {
          created_at?: string | null
          edited_at?: string | null
          group_id?: string
          id?: string
          message_content?: string
          message_type?: Database["public"]["Enums"]["message_type"] | null
          reactions?: Json | null
          read_by?: string[] | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_lesson_messages: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          message: string
          sender_id: string
          sender_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          message: string
          sender_id: string
          sender_name: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          message?: string
          sender_id?: string
          sender_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_lesson_messages_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "live_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      live_lesson_participants: {
        Row: {
          hand_raised: boolean
          id: string
          joined_at: string
          left_at: string | null
          lesson_id: string
          role: string
          user_id: string
          user_name: string
        }
        Insert: {
          hand_raised?: boolean
          id?: string
          joined_at?: string
          left_at?: string | null
          lesson_id: string
          role: string
          user_id: string
          user_name: string
        }
        Update: {
          hand_raised?: boolean
          id?: string
          joined_at?: string
          left_at?: string | null
          lesson_id?: string
          role?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_lesson_participants_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "live_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      live_lessons: {
        Row: {
          classroom_id: string
          created_at: string
          description: string | null
          ended_at: string | null
          id: string
          started_at: string
          status: string
          teacher_id: string
          title: string
        }
        Insert: {
          classroom_id: string
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          status?: string
          teacher_id: string
          title: string
        }
        Update: {
          classroom_id?: string
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          status?: string
          teacher_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_lessons_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          last_login: string | null
          oauth_provider: string | null
          profile_picture_url: string | null
          subjects: string[] | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          last_login?: string | null
          oauth_provider?: string | null
          profile_picture_url?: string | null
          subjects?: string[] | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          oauth_provider?: string | null
          profile_picture_url?: string | null
          subjects?: string[] | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webrtc_signals: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          lesson_id: string
          signal_data: Json
          signal_type: string
          to_user_id: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          lesson_id: string
          signal_data: Json
          signal_type: string
          to_user_id: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          lesson_id?: string
          signal_data?: Json
          signal_type?: string
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webrtc_signals_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "live_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_group_member_profiles: {
        Args: { _group_id: string }
        Returns: {
          full_name: string
          id: string
          profile_picture_url: string
          subjects: string[]
          user_type: Database["public"]["Enums"]["user_type"]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_classroom_member: {
        Args: { _classroom_id: string; _user_id: string }
        Returns: boolean
      }
      is_classroom_teacher: {
        Args: { _classroom_id: string; _user_id: string }
        Returns: boolean
      }
      is_group_admin: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      is_group_member: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      is_teacher: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      group_role: "member" | "admin" | "creator"
      group_type:
        | "study_group"
        | "class_discussion"
        | "project_team"
        | "general"
      message_type: "text" | "image" | "file" | "system"
      user_type: "student" | "teacher" | "admin"
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
      app_role: ["admin", "moderator", "user"],
      group_role: ["member", "admin", "creator"],
      group_type: [
        "study_group",
        "class_discussion",
        "project_team",
        "general",
      ],
      message_type: ["text", "image", "file", "system"],
      user_type: ["student", "teacher", "admin"],
    },
  },
} as const
