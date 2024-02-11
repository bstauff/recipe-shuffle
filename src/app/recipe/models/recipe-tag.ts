import { Ulid, Uuid } from 'id128';

export class RecipeTag {
  key: string;
  name: string;

  constructor(name: string) {
    const ulidKey = Ulid.generate().toRaw();
    this.key = Uuid.fromRaw(ulidKey).toCanonical();
    this.name = name;
  }
}
