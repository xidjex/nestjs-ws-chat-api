import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Exception filters
import { EntityNotFoundExceptionFilter } from './exception-filters/entity-not-found-exception.filter';
import { UserAlreadyExistExceptionFilter } from './exception-filters/user-already-exist-exception.filter';
import { UserBannedExceptionFilter } from './exception-filters/user-banned-exception.filter';
import { InvalidTokenExceptionFilter } from './exception-filters/invalid-token-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new EntityNotFoundExceptionFilter(),
    new UserAlreadyExistExceptionFilter(),
    new UserBannedExceptionFilter(),
    new InvalidTokenExceptionFilter(),
  );
  await app.listen(4000);
}
bootstrap();
