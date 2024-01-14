// import mongoose from 'mongoose';
const jwt = require('jsonwebtoken');

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
const cookieSession = require('cookie-session');
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({ keys: ['asdwasaxcsd'] }));
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000);
}
bootstrap();
