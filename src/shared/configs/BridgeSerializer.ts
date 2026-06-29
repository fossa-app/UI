import type { IJsonSerializer } from '@fossa-app/bridge/Services/IJsonSerializer';

const enquoteLongNumberRegex = /(?<=[\x5B:,]\s*)(-?\d{15,})(?=\s*[,}])/gu;
const dequoteLongNumberRegex = /(?<=[\x5B:,]\s*)"(-?\d{15,})"(?=\s*[,}])/gu;

const lowerFirst = (value: string): string => {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;
};

const upperFirst = (value: string): string => {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
};

const isTransformableObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  return Object.prototype.toString.call(value) === '[object Object]';
};

const toCamelCaseKeys = (value: unknown): unknown => {
  if (typeof value === 'bigint') {
    return Number.isSafeInteger(Number(value)) ? Number(value) : value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(toCamelCaseKeys);
  }

  if (!isTransformableObject(value)) {
    return value;
  }

  return Object.fromEntries(Object.entries(value).map(([key, entryValue]) => [lowerFirst(key), toCamelCaseKeys(entryValue)]));
};

const addPascalCaseAliases = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(addPascalCaseAliases);
  }

  if (!isTransformableObject(value)) {
    return value;
  }

  return Object.entries(value).reduce<Record<string, unknown>>((result, [key, entryValue]) => {
    const normalizedValue = addPascalCaseAliases(entryValue);

    result[key] = normalizedValue;
    result[upperFirst(key)] = normalizedValue;

    return result;
  }, {});
};

export class BridgeJsonSerializer implements IJsonSerializer {
  Deserialize<T>(json: string): T {
    if (!json.trim()) {
      return undefined as T;
    }

    const parsed = JSON.parse(json.replace(enquoteLongNumberRegex, '"$1"'));

    return addPascalCaseAliases(parsed) as T;
  }

  Serialize<T>(value: T): string {
    return JSON.stringify(toCamelCaseKeys(value)).replace(dequoteLongNumberRegex, '$1');
  }
}
