import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // prevent sql injection
  app.use(mongoSanitize());
  // Use Helmet to add security to headers
  app.use(helmet());
  // prevent xss attack
  app.use(xss());
  // prevent attack: http parameter pollution
  app.use(hpp());
  // enable cors
  app.use(cors());

  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
  });
  // Apply the rate limiting middleware to all requests.
  app.use(limiter);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000);
}
bootstrap();
