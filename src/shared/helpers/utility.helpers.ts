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

export const deepEqual = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (val1 !== null && typeof val1 === 'object' && val2 !== null && typeof val2 === 'object') {
      if (!deepEqual(val1, val2)) {
        return false;
      }
    } else if (val1 !== val2) {
      return false;
    }
  }

  return true;
};

export const deepCopyObject = <T>(obj: T | undefined): T | undefined => {
  return obj ? structuredClone(obj) : obj;
};

export const calculateUsagePercent = (current?: number, max?: number): number => {
  if (!current || !max) {
    return 0;
  }

  return Math.round((current / max) * 100);
};

export const getEntityIdsByField = <T>(items: T[], field: keyof T = 'id' as keyof T): number[] => {
  return Array.from(new Set(items.map((item) => item[field] as number).filter((fieldValue) => fieldValue)));
};
