import { RecipeIngredient } from './recipeingredient';

export class Recipe {
  id: number;
  name: string;
  url: string | null | undefined;
  recipeIngredients: RecipeIngredient[] = [];
}
