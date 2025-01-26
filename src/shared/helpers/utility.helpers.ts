export const filterUniqueByField = <T extends Record<string, any>>(items: T[], field: keyof T): T[] => {
  const seen = new Set<any>();

  return items.filter((item) => {
    const fieldValue = item[field];

    if (seen.has(fieldValue)) {
      return false;
    }

    seen.add(fieldValue);

    return true;
  });
};

export const getNestedValue = <T>(values: T, path: string): unknown => {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
  }, values as unknown);
};
