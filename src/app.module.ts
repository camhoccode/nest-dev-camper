import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { TutorialsModule } from './tutorials/tutorials.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    RouterModule.register([
      {
        path: 'api/v1/category',
        module: CategoryModule,
      },
      {
        path: 'api/v1/tutorials',
        module: TutorialsModule,
      },
      {
        path: 'api/v1/users',
        module: UsersModule,
      },
      {
        path: 'api/v1/auth',
        module: AuthModule,
      },
    ]),
    CategoryModule,
    TutorialsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
