import { Ulid, Uuid } from 'id128';

export class Tag {
  key: string;
  name: string;
  created_at: string;
  modified_on: string | null;

  constructor(name: string) {
    const ulidKey = Ulid.generate().toRaw();
    this.key = Uuid.fromRaw(ulidKey).toCanonical();
    this.name = name;
    this.created_at = new Date().toISOString();
    this.modified_on = new Date().toISOString();
  }
}
