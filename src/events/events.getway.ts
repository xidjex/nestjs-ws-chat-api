import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, UseFilters } from '@nestjs/common';

// Guards
import { AuthJwtWsGuard } from 'src/auth/auth.jwt-ws.guard';
import { MessagesGuard } from '../auth/messages.guard';

// Services
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

// Exceptions
import { UsersOnlineService } from './users-online.service';
import { AllWsExceptionsFilter } from './all-ws.exception.filter';

@WebSocketGateway()
@UseFilters(AllWsExceptionsFilter)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly usersOnlineService: UsersOnlineService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket): Promise<void> {
    try {
      const { token } = socket.handshake.query;

      const tokenPayload = await this.authService.verifyToken(token);

      const user = await this.authService.validateUser(tokenPayload.id);

      if (user) {
        this.usersOnlineService.add(user);

        this.server.emit('users-online', this.usersOnlineService.toArray());
      }
    } catch (exception) {
      socket.emit('exception', {
        type: exception.name,
        message: exception.message,
      });
    }
  }

  @UseGuards(AuthJwtWsGuard)
  handleDisconnect(socket: Socket) {
    const user = socket.handshake.query.user;

    if (user) {
      this.usersOnlineService.delete(user.id);

      socket.emit('users-online', this.usersOnlineService.toArray());
    }
  }

  @UseGuards(AuthJwtWsGuard, new MessagesGuard())
  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: unknown, @ConnectedSocket() socket: Socket): void {
    socket.broadcast.emit('message', data);
  }
}
