import * as React from 'react';

export type Item = Record<string, any>;

export interface Column<T = Item> {
  name: React.ReactNode;
  field: keyof T extends string | number ? keyof T : never;
  // eslint-disable-next-line no-unused-vars
  renderBodyCell?: (item: T) => React.ReactNode;
}
