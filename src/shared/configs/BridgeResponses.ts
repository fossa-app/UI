import type { PagingResponseModel$1 } from '@fossa-app/bridge/Models/ApiModels/EnvelopeModels';
import type { PaginatedResponse } from 'shared/types';

const getPagination = <T>(response: PagingResponseModel$1<T>) => ({
  pageNumber: response.pageNumber ?? undefined,
  pageSize: response.pageSize ?? undefined,
  totalItems: response.totalItems ?? undefined,
  totalPages: response.totalPages ?? undefined,
});

export const toPaginatedResponse = <T>(response: PagingResponseModel$1<T>): PaginatedResponse<T> => ({
  ...getPagination(response),
  items: [...(response.items ?? [])],
});

export const mapPaginatedResponse = <TSource, TTarget>(
  response: PagingResponseModel$1<TSource>,
  mapItem: (item: TSource) => TTarget
): PaginatedResponse<TTarget> => ({
  ...getPagination(response),
  items: [...(response.items ?? [])].map(mapItem),
});
