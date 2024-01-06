import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';

// export const advancedResult =
@Injectable()
export class AdvancedResultMiddleware implements NestMiddleware {
  use(model: Model<any>, populate?: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      let query;
      const reqQuery = { ...req.query };

      // exclude fields
      const removeFields = ['select', 'sort', 'page', 'perpage'];
      removeFields.forEach((field) => delete reqQuery[field]);

      // create query string
      let queryStr = JSON.stringify(reqQuery);
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`,
      );

      // find items based on query
      query = model.find(JSON.parse(queryStr));

      // select fields
      if (req.query.select) {
        const stringSelectionFields = req?.query?.select
          .toString()
          .split(',')
          .join(' ');
        query = query.select(stringSelectionFields);
      }
      // sort fields
      if (req.query.sort) {
        const sortBy = req.query.sort.toString().split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('createdAt');
      }

      // pageination
      const page = parseInt(req?.query?.page?.toString(), 10) || 1;
      const perpage = parseInt(req?.query?.perpage?.toString(), 10) || 3;
      const startIndex = (page - 1) * perpage;
      const endIndex = page * perpage;
      const total = await model.countDocuments();

      query = query.skip(startIndex).limit(perpage);

      if (populate) {
        query = query.populate(populate);
      }

      const results = await query;

      // pagination result
      const pagination = {};
      if (endIndex < total) {
        pagination['next'] = {
          page: page + 1,
          perpage,
        };
      }
      if (page > 1) {
        pagination['prev'] = {
          page: page - 1,
          perpage,
        };
      }

      res['advanceResult'] = {
        count: total,
        pagination,
        data: results,
      };

      next();
    };
  }
}
