import { FieldErrors, FieldValues } from 'react-hook-form';
import type { PagingResponseModel$1 } from '@fossa-app/bridge/Models/ApiModels/EnvelopeModels';
import type { ProblemDetailsModel } from '@fossa-app/bridge/Models/ApiModels/SharedModels';

type UiProblemDetails = Partial<ProblemDetailsModel> & {
  type?: ProblemDetailsModel['Type'];
  title?: ProblemDetailsModel['Title'];
  status?: ProblemDetailsModel['Status'];
  detail?: ProblemDetailsModel['Detail'];
  instance?: ProblemDetailsModel['Instance'];
  traceId?: string;
};

export type ValidationProblemDetails = UiProblemDetails & {
  errors?: Record<string, string[]>;
};

export type ErrorResponse<T extends FieldValues> = Omit<ValidationProblemDetails, 'errors'> & {
  errors?: FieldErrors<T>;
};

export type GeneralErrorResponse = ValidationProblemDetails | ErrorResponse<FieldValues>;

export type PaginatedResponse<T> = Partial<PagingResponseModel$1<T>> & {
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
