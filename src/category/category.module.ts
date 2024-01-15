import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategorySchema } from './schemas/category.schema';
import { UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'categories', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
  ],
  controllers: [CategoryController],
  providers: [
    {
      provide: 'CategoryService',
      useClass: CategoryService,
    },
    UsersService,
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
