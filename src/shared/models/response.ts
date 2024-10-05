export interface ErrorResponse {
  type?: string;
  title?: string;
  traceId?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
  items: T[];
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}
