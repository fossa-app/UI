import { FieldErrors, FieldValues } from 'react-hook-form';
import type { ProblemDetailsModel } from '@fossa-app/bridge/Models/ApiModels/SharedModels';

type PagingResponseModel<T> = import('@fossa-app/bridge/Models/ApiModels/EnvelopeModels').PagingResponseModel$1<T>;
export type { ProblemDetailsModel } from '@fossa-app/bridge/Models/ApiModels/SharedModels';

export type ErrorResponse<T extends FieldValues> = Omit<Partial<ProblemDetailsModel>, 'errors'> & {
  errors?: FieldErrors<T>;
};

export type GeneralErrorResponse = ProblemDetailsModel | ErrorResponse<FieldValues>;

export type PaginatedResponse<T> = Omit<
  Partial<PagingResponseModel<T>>,
  'pageNumber' | 'pageSize' | 'items' | 'totalItems' | 'totalPages'
> & {
  pageNumber?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  items: T[];
};

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  totalItems?: number;
  totalPages?: number;
}
