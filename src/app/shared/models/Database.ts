export interface Database {
  public: {
    Tables: {
      recipe: {
        Row: {
          key: string;
          name: string;
          url: string;
        };
        Insert: {
          key: string;
          name: string;
          url: string;
        };
        Update: {
          name: string;
          url: string;
          modified_on: Date;
        };
      };
      recipe_ingredient: {
        Row: {
          key: string;
          name: string;
          quantity: number;
        };
        Insert: {
          key: string;
          name: string;
          quantity: number;
        };
        Update: {
          name: string;
          quantity: number;
          modified_on: Date;
        };
      };
    };
  };
}
