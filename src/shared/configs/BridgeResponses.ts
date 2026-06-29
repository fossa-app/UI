import type { PagingResponseModel$1 } from '@fossa-app/bridge/Models/ApiModels/EnvelopeModels';
import type { PaginatedResponse } from 'shared/types';

const toNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  return Number(value);
};

export const toPaginatedResponse = <T>(value: unknown): PaginatedResponse<T> => {
  const response = value as PagingResponseModel$1<unknown>;
  const items = [...(response.items ?? [])] as T[];

  return {
    pageNumber: toNumber(response.pageNumber),
    pageSize: toNumber(response.pageSize),
    totalItems: toNumber(response.totalItems),
    totalPages: toNumber(response.totalPages),
    items,
  };
};
