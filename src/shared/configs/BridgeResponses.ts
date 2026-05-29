import type { ValidationProblemDetails, PaginatedResponse } from 'shared/types';

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
};

const read = <T>(
  value: unknown,
  pascalName: string,
  camelName = `${pascalName.charAt(0).toLowerCase()}${pascalName.slice(1)}`
): T | undefined => {
  const record = asRecord(value);

  return (record[camelName] ?? record[pascalName]) as T | undefined;
};

const toNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  return Number(value);
};

const toErrorResponse = (problem: unknown): ValidationProblemDetails => {
  return {
    type: read<string>(problem, 'Type'),
    title: read<string>(problem, 'Title'),
    status: read<number>(problem, 'Status'),
  };
};

export const unwrapBridgeValue = <T>(result: unknown): T => {
  if (!read<boolean>(result, 'Succeeded')) {
    throw toErrorResponse(read(result, 'Problem'));
  }

  const value = read<unknown>(result, 'Value');

  if (value === null || value === undefined) {
    throw {};
  }

  return value as T;
};

export const unwrapBridgeUnitResult = (result: unknown): void => {
  if (!read<boolean>(result, 'Succeeded')) {
    throw toErrorResponse(read(result, 'Problem'));
  }
};

export const unwrapBridgePagingResponse = <T>(result: unknown): PaginatedResponse<T> => {
  const value = unwrapBridgeValue<unknown>(result);
  const items = read<T[]>(value, 'Items') ?? [];

  return {
    pageNumber: toNumber(read(value, 'PageNumber')),
    pageSize: toNumber(read(value, 'PageSize')),
    totalItems: toNumber(read(value, 'TotalItems')),
    totalPages: toNumber(read(value, 'TotalPages')),
    items,
  };
};
