export interface PaginationInput {
  page: number;
  perPage: number;
}

export interface SortInput {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
