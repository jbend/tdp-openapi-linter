/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

//import { AppModule } from './app/app.module';
import { LinterModule } from './linter/linter.module';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const linter = await NestFactory.create(LinterModule);
  const globalPrefix = 'v1';
  linter.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await linter.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
