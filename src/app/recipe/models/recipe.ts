import { Ingredient } from './ingredient';
import { Ulid, Uuid } from 'id128';

export class Recipe {
  key: string;
  name: string;
  url: string | null;
  ingredients: Ingredient[];
  created_at: string;
  modified_on: string;
  constructor(name: string, url: string) {
    const ulidKey = Ulid.generate().toRaw();
    const uuidKey = Uuid.fromRaw(ulidKey);

    this.key = uuidKey.toCanonical();
    this.name = name;
    this.url = url;
    this.ingredients = [];
    this.created_at = new Date().toISOString();
    this.modified_on = new Date().toISOString();
  }
}
