import {
  // MiddlewareConsumer,
  Module,
  // NestModule,
  // RequestMethod,
  // Scope,
} from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema, CatsModel } from './schemas/category.schema';
// import { AdvancedResultMiddleware } from 'src/middleware/advancedResult.middleware';
// import { Model } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'categories', schema: CategorySchema }]),
  ],
  controllers: [CategoryController],
  providers: [
    {
      provide: 'CategoryService',
      useClass: CategoryService,
    },
  ],
})
export class CategoryModule {}
// export class CategoryModule implements NestModule {
//   constructor(
//     @InjectModel('categories')
//     private readonly categoryModel: Model<Category>,
//   ) {}
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(new AdvancedResultMiddleware().use(this.categoryModel, 'tuts'))
//       .forRoutes({
//         path: 'api/v1/category',
//         method: RequestMethod.GET,
//       });
//   }
// }
