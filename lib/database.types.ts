export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      recipe: {
        Row: {
          created_at: string;
          key: string;
          modified_on: string;
          name: string;
          url: string | null;
          user_id: string;
          is_deleted: boolean;
        };
        Insert: {
          created_at?: string;
          key: string;
          modified_on?: string;
          name: string;
          url?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          key?: string;
          modified_on?: string;
          name?: string;
          url?: string | null;
          user_id?: string;
          is_deleted?: boolean | null;
        };
      };
      recipe_ingredient: {
        Row: {
          created_at: string;
          key: string;
          modified_on: string;
          name: string;
          quantity: number;
          recipe_key: string;
          user_id: string;
          is_deleted: boolean;
        };
        Insert: {
          created_at?: string;
          key: string;
          modified_on?: string;
          name: string;
          quantity: number;
          recipe_key: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          key?: string;
          modified_on?: string;
          name?: string;
          quantity?: number;
          recipe_key?: string;
          user_id?: string;
          is_deleted?: boolean;
        };
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
}
