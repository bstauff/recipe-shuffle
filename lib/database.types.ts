export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      recipe: {
        Row: {
          created_at: string
          key: string
          modified_on: string
          name: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          key: string
          modified_on?: string
          name: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          key?: string
          modified_on?: string
          name?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recipe_ingredient: {
        Row: {
          created_at: string
          key: string
          modified_on: string
          name: string
          quantity: number
          recipe_key: string
          user_id: string
        }
        Insert: {
          created_at?: string
          key: string
          modified_on?: string
          name: string
          quantity: number
          recipe_key: string
          user_id: string
        }
        Update: {
          created_at?: string
          key?: string
          modified_on?: string
          name?: string
          quantity?: number
          recipe_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredient_recipe_key_fkey"
            columns: ["recipe_key"]
            referencedRelation: "recipe"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "recipe_ingredient_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recipe_tag: {
        Row: {
          created_at: string
          key: string
          modified_on: string | null
          name: string
          recipe_key: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          key?: string
          modified_on?: string | null
          name: string
          recipe_key: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          key?: string
          modified_on?: string | null
          name?: string
          recipe_key?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_tag_recipe_key_fkey"
            columns: ["recipe_key"]
            referencedRelation: "recipe"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "recipe_tag_user_id_fkey"
            columns: ["user_id"]
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
