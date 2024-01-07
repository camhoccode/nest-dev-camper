export interface IPagination {
  page: number;
  perPage: number;
  skip: number;
}

export const DEFAULT_PAGINATION_PAGE = 1;
export const DEFAULT_PAGINATION_PER_PAGE = 3;
