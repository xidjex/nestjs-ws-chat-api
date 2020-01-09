import { Catch, ArgumentsHost } from '@nestjs/common';
import { Socket } from 'socket.io';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

// Event types
import { Events } from './events.getway';

@Catch()
export class AllWsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    client
      .emit(Events.exception, {
        type: exception.name,
        message: exception.message,
      });
  }
}
