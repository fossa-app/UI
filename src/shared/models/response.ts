import { FieldErrors, FieldValues } from 'react-hook-form';

export interface ErrorResponseDTO {
  type?: string;
  title?: string;
  traceId?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ErrorResponse<T extends FieldValues> extends Omit<ErrorResponseDTO, 'errors'> {
  errors?: FieldErrors<T>;
}

export type GeneralErrorResponse = ErrorResponseDTO | ErrorResponse<FieldValues>;

export interface PaginatedResponse<T> {
  pageNumber?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  items: T[];
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  totalItems?: number;
  totalPages?: number;
}
