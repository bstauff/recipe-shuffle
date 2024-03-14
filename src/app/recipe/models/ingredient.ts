import { Ulid, Uuid } from 'id128';

export class Ingredient {
  key: string;
  name: string;
  units: string;

  constructor(name: string, units: string) {
    this.name = name;
    this.units = units;

    const ulidKey = Ulid.generate().toRaw();
    const uuidKey = Uuid.fromRaw(ulidKey);

    this.key = uuidKey.toCanonical();
  }
}
