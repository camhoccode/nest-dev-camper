import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Db connected');
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);
}
bootstrap();
