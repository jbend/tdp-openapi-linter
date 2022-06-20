/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';

import { LinterModule } from './linter/linter.module';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const linter = await NestFactory.create(LinterModule);
  const globalPrefix = 'v1';
  linter.setGlobalPrefix(globalPrefix);
  linter.use(bodyParser.json({limit: '100mb'}));
  linter.use(bodyParser.urlencoded({limit: '100mb'}));
  const port = process.env.PORT || 3333;
  await linter.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
