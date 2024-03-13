import { Ulid, Uuid } from 'id128';

export interface Ingredient {
  key: string;
  name: string;
  units: string;
}

export function newIngredientKey(): string {
  const ulidKey = Ulid.generate().toRaw();
  const uuidKey = Uuid.fromRaw(ulidKey);
  return uuidKey.toCanonical();
}
