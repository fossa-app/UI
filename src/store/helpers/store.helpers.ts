import { BaseEntity } from 'shared/types';

export const mergePaginatedItems = <T extends BaseEntity>(existingItems: T[] | undefined, newItems: T[] | undefined): T[] => {
  if (!newItems?.length) {
    return existingItems || [];
  }

  const existing = existingItems || [];
  const existingIds = new Set(existing.map(({ id }) => id));
  return [...existing, ...newItems.filter(({ id }) => !existingIds.has(id))];
};
