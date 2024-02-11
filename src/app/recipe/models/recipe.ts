import { Ulid, Uuid } from 'id128';
import { RecipeTag } from './recipe-tag';
import { RecipeIngredient } from './recipe-ingredient';

export class Recipe {
  key: string;
  name: string;
  url: string | null;
  ingredients: RecipeIngredient[];
  tags: RecipeTag[];

  constructor(name: string, url: string) {
    const ulidKey = Ulid.generate().toRaw();
    const uuidKey = Uuid.fromRaw(ulidKey);

    this.key = uuidKey.toCanonical();
    this.name = name;
    this.url = url;
    this.ingredients = [];
    this.tags = [];
  }
}