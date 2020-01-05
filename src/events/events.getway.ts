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
import { MessagesService } from 'src/messages/messages.service';

// Exceptions
import { UsersOnlineService } from './users-online.service';
import { AllWsExceptionsFilter } from './all-ws.exception.filter';

// Entities
import { User } from '../users/entities/user.entity';

@WebSocketGateway()
@UseFilters(AllWsExceptionsFilter)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly usersOnlineService: UsersOnlineService,
    private readonly messagesService: MessagesService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket): Promise<void> {
    try {
      const user = await this.authUser(socket);
      const messages = await this.messagesService.getList();

      this.usersOnlineService.add(socket.id, user);

      this.server.emit('users-online', this.usersOnlineService.toArray());
      socket.emit('messages', messages);

      if (user.isAdmin) {
        const users = await this.userService.findAll();

        socket.emit('users-list', users);
      }
    } catch (exception) {
      socket.emit('exception', {
        type: exception.name,
        message: exception.message,
      });
    }
  }

  handleDisconnect(socket: Socket) {
    this.usersOnlineService.delete(socket.id);

    socket.emit('users-online', this.usersOnlineService.toArray());
  }

  @UseGuards(AuthJwtWsGuard, new MessagesGuard())
  @SubscribeMessage('messages')
  async handleEvent(
    @MessageBody() data: unknown,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const{ user } = socket.handshake.query;

    const message = await this.messagesService.create(data as string, user);

    socket.broadcast.emit('messages', [message]);
  }

  async authUser(socket: Socket): Promise<User> {
    const { token } = socket.handshake.query;

    const tokenPayload = await this.authService.verifyToken(token);

    return this.authService.validateUser(tokenPayload.id);
  }
}
