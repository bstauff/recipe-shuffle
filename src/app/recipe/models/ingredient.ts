import { Ulid, Uuid } from 'id128';

export class Ingredient {
  key: string;
  name: string;
  quantity: number;
  created_at: string;
  modified_on: string;

  constructor(name: string, quantity: number) {
    const ulidKey = Ulid.generate().toRaw();
    this.key = Uuid.fromRaw(ulidKey).toCanonical();
    this.name = name;
    this.quantity = quantity;
    this.created_at = new Date().toISOString();
    this.modified_on = new Date().toISOString();
  }
}
