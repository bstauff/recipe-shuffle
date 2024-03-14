import { Ulid, Uuid } from 'id128';
import { Ingredient } from './ingredient';
export class RecipeIngredient {
  key: string;
  quantity: number;
  ingredient: Ingredient;
  constructor(ingredient: Ingredient, quantity: number) {
    this.quantity = quantity;
    this.ingredient = ingredient;

    const ulidKey = Ulid.generate().toRaw();
    const uuidKey = Uuid.fromRaw(ulidKey);

    this.key = uuidKey.toCanonical();
  }
}
