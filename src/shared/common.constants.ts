export interface IPagination {
  page: number;
  perpage: number;
  skip: number;
}

export const DEFAULT_PAGINATION_PAGE = 1;
export const DEFAULT_PAGINATION_PER_PAGE = 3;

export enum EUserRole {
  superadmin = 0,
  admin = 1,
  teacher = 2,
  user = 3,
}

export interface JwtPayload {
  uuid: string;
  username: string;
  role: EUserRole;
  iat?: number;
  exp?: number;
}
