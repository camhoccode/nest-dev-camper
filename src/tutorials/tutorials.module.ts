import { Module } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { TutorialsController } from './tutorials.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TutorialSchema } from './schemas/tutotial.schema';
import { UsersService } from 'src/users/users.service';
import { UserSchema } from 'src/users/schemas/user.schema';
import { CategorySchema } from 'src/category/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'tuts', schema: TutorialSchema }]),
    MongooseModule.forFeature([{ name: 'categories', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
  ],
  controllers: [TutorialsController],
  providers: [TutorialsService, UsersService],
})
export class TutorialsModule {}
