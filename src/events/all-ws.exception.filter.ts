import { Catch, ArgumentsHost } from '@nestjs/common';
import { Socket } from 'socket.io';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class AllWsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    client
      .emit('error', {
        type: exception.name,
        message: exception.message,
      });
  }
}
