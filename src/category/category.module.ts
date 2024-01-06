import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategorySchema, CatsModel } from './schemas/category.schema';
import { AdvancedResultMiddleware } from 'src/middleware/advancedResult.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
// export class CategoryModule {}
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new AdvancedResultMiddleware().use(CatsModel)).forRoutes({
      path: 'category',
      method: RequestMethod.GET,
    });
  }
}
