export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ingredient: {
        Row: {
          key: string
          name: string
          quantity: number
          recipe_key: string
          units: string
          user_id: string
        }
        Insert: {
          key: string
          name: string
          quantity: number
          recipe_key: string
          units: string
          user_id?: string
        }
        Update: {
          key?: string
          name?: string
          quantity?: number
          recipe_key?: string
          units?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_recipeingredient_recipe_key_fkey"
            columns: ["recipe_key"]
            isOneToOne: false
            referencedRelation: "recipe"
            referencedColumns: ["recipe_key"]
          },
          {
            foreignKeyName: "recipeingredient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recipe: {
        Row: {
          name: string
          recipe_key: string
          url: string | null
          user_id: string
        }
        Insert: {
          name: string
          recipe_key: string
          url?: string | null
          user_id: string
        }
        Update: {
          name?: string
          recipe_key?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recipetag: {
        Row: {
          id: number
          recipe_key: string
          tag_id: number
          user_id: string
        }
        Insert: {
          id?: number
          recipe_key: string
          tag_id: number
          user_id?: string
        }
        Update: {
          id?: number
          recipe_key?: string
          tag_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_recipetag_recipe_key_fkey"
            columns: ["recipe_key"]
            isOneToOne: false
            referencedRelation: "recipe"
            referencedColumns: ["recipe_key"]
          },
          {
            foreignKeyName: "recipetag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipetag_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tag: {
        Row: {
          id: number
          name: string
          tag_key: string
          user_id: string
        }
        Insert: {
          id?: number
          name: string
          tag_key: string
          user_id?: string
        }
        Update: {
          id?: number
          name?: string
          tag_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
