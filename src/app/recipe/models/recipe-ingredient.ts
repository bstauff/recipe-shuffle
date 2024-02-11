import { Ulid, Uuid } from 'id128';

export class RecipeIngredient {
  key: string;
  name: string;
  quantity: number;
  unit: string;

  constructor(name: string, quantity: number, unit: string) {
    const ulidKey = Ulid.generate().toRaw();
    this.key = Uuid.fromRaw(ulidKey).toCanonical();
    this.name = name;
    this.quantity = quantity;
    this.unit = unit;
  }
}
