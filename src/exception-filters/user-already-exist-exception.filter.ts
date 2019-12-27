import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { UserAlreadyExistException } from '../users/exceptions/user.already-exist.exception';

@Catch(UserAlreadyExistException)
export class UserAlreadyExistExceptionFilter<T> implements ExceptionFilter {
  catch(exception: UserAlreadyExistException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(HttpStatus.CONFLICT)
      .json({
        statusCode: HttpStatus.CONFLICT,
        error: exception.name,
        message: exception.message,
      });
  }
}
