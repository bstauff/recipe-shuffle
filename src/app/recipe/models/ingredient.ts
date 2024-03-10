import { Ulid, Uuid } from 'id128';

export interface Ingredient {
  key: string;
  quantity: number;
  name: string;
  units: string;
  recipeKey: string;
}

export function newIngredientKey(): string {
  const ulidKey = Ulid.generate().toRaw();
  const uuidKey = Uuid.fromRaw(ulidKey);
  return uuidKey.toCanonical();
}
