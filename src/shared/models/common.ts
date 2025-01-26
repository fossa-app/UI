export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type FlattenField<T> = {
  [P in keyof T]: T[P] extends object ? FlattenField<T[P]> & { field: P; name: string } : { field: P; name: string };
};

export type Item = Record<string, any>;

export interface Country {
  name: string;
  code: string;
}

export interface TimeZone {
  id: string;
  name: string;
  countryCode: Country['code'];
  currentOffset: string;
}
