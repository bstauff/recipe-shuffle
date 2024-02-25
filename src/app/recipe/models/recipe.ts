import { Ulid, Uuid } from 'id128';

export class Recipe {
  key: string;
  name: string;
  url: string | null | undefined;

  constructor(name: string, url: string | null | undefined) {
    const ulidKey = Ulid.generate().toRaw();
    const uuidKey = Uuid.fromRaw(ulidKey);

    this.key = uuidKey.toCanonical();
    this.name = name;
    this.url = url;
  }
}
