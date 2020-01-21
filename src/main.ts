import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import { EntityNotFoundExceptionFilter } from './exception-filters/entity-not-found-exception.filter';
import { UserAlreadyExistExceptionFilter } from './exception-filters/user-already-exist-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new EntityNotFoundExceptionFilter(),
    new UserAlreadyExistExceptionFilter(),
  );
  await app.listen(4000);
}
bootstrap();
