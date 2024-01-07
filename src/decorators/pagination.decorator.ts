import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import {
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_PER_PAGE,
  IPagination,
} from 'src/shared/common.constants';

export const PaginationParamDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IPagination => {
    const req = ctx.switchToHttp().getRequest();
    const page =
      req.query.page && +req.query.page > 0
        ? +req.query.page
        : DEFAULT_PAGINATION_PAGE;
    const perPage =
      req.query.perPage && +req.query.perPage > 0
        ? +req.query.perPage
        : DEFAULT_PAGINATION_PER_PAGE;

    return {
      page,
      perPage,
      skip: page * perPage,
    };
  },
);
