import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

// Exceptions
import { InvalidTokenException } from '../common/exceptions/invalid-token.exception';

@Catch(InvalidTokenException)
export class InvalidTokenExceptionFilter<T> implements ExceptionFilter {
  catch(exception: InvalidTokenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(HttpStatus.UNAUTHORIZED)
      .json({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: exception.name,
        message: exception.message,
      });
  }
}
