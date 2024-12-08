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
