import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { TutorialsModule } from './tutorials/tutorials.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';

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
    ]),
    CategoryModule,
    TutorialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
