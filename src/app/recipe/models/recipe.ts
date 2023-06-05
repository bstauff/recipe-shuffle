import { Ingredient } from './ingredient';

export interface Recipe {
  id: number;
  name: string;
  url: string;
  ingredients: Ingredient[];
}
