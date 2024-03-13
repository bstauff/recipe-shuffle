import { Ingredient } from './ingredient';
import { Recipe } from './recipe';

export interface RecipeIngredient {
  key: string;
  quantity: number;
  ingredient: Ingredient;
  recipe: Recipe;
}
