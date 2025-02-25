import { RecipeIngredient } from './recipeingredient';

export interface Recipe {
  id: number;
  name: string;
  url: string | null | undefined;
  recipeIngredients: RecipeIngredient[];
}
