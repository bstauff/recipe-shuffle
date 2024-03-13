import { Ulid, Uuid } from 'id128';
import { RecipeIngredient } from './recipeingredient';

export class Recipe {
  key: string;
  name: string;
  url: string | null | undefined;
  recipeIngredients: RecipeIngredient[] = [];

  constructor(name: string, url: string | null | undefined) {
    const ulidKey = Ulid.generate().toRaw();
    const uuidKey = Uuid.fromRaw(ulidKey);

    this.key = uuidKey.toCanonical();
    this.name = name;
    this.url = url;
  }
}
