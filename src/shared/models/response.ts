import { FieldErrors, FieldValues } from 'react-hook-form';

// TODO: change to ErrorResponseDTO
export interface ErrorResponse {
  type?: string;
  title?: string;
  traceId?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// TODO: change to ErrorResponse
export interface ErrorResponseUI<T extends FieldValues> extends Omit<ErrorResponse, 'errors'> {
  errors?: FieldErrors<T>;
}

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
