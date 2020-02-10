import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

// Exceptions
import { UserBannedException } from '../common/exceptions/user-banned.exception';

@Catch(UserBannedException)
export class UserBannedExceptionFilter<T> implements ExceptionFilter {
  catch(exception: UserBannedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(HttpStatus.FORBIDDEN)
      .json({
        statusCode: HttpStatus.FORBIDDEN,
        error: exception.name,
        message: exception.message,
      });
  }
}
