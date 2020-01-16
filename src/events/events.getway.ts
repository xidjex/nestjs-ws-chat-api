import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

// Guards
import { AuthJwtWsGuard } from 'src/auth/auth.jwt-ws.guard';
import { MessagesGuard } from './guards/messages.guard';
import { AdminGuard } from './guards/admin.guard';

// Services
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { MessagesService } from 'src/messages/messages.service';

// Exceptions
import { UsersOnlineService } from './users-online.service';
import { AllWsExceptionsFilter } from './all-ws.exception.filter';

// Entities
import { User, UserStatus } from '../users/entities/user.entity';

// DTO
import { UserStatusChangeDto } from './dto/user-status-change.dto';
import { MessageDto } from './dto/message.dto';

export enum Events {
  usersOnline = 'users-online',
  usersOnlineUpdate = 'users-online-update',
  usersList = 'users-list',
  usersListUpdate = 'users-list-update',
  messages = 'messages',
  userStatusChange = 'user-status-change',
  exception = 'exception',
}

@WebSocketGateway()
@UsePipes(new ValidationPipe())
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

      this.usersOnlineService.add(user, socket);

      this.server.emit(Events.usersOnline, this.usersOnlineService.toArray());
      socket.emit(Events.messages, messages);

      if (user.isAdmin) {
        const users = await this.userService.findAll();

        socket.emit(Events.usersList, users);
      }
    } catch (exception) {
      socket.emit(Events.exception, {
        type: exception.name,
        message: exception.message,
      });
    }
  }

  handleDisconnect(socket: Socket) {
    this.usersOnlineService.delete(socket);

    socket.emit(Events.usersOnline, this.usersOnlineService.toArray());
  }

  @UseGuards(AuthJwtWsGuard, MessagesGuard)
  @SubscribeMessage('messages')
  async handleEvent(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const { user } = socket.handshake.query;

    const newMessage = await this.messagesService.create(message.text, user);

    this.usersOnlineService.update(user, null, new Date());

    socket.broadcast.emit(Events.messages, [newMessage]);
  }

  @UseGuards(AuthJwtWsGuard, AdminGuard)
  @SubscribeMessage(Events.userStatusChange)
  async handleUserStatusChange(
    @MessageBody() data: UserStatusChangeDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user = await this.userService.updateStatus(data.id, data.status);
    const { socket: userSocket } = this.usersOnlineService.get(user.id) || {};

    if (data.status === UserStatus.banned && userSocket) {
        userSocket.disconnect(true);
    } else {
      this.usersOnlineService.update(user);

      this.server.emit(Events.usersOnlineUpdate, [user]);
    }

    socket.emit(Events.usersListUpdate, user);
  }

  async authUser(socket: Socket): Promise<User> {
    const { token } = socket.handshake.query;

    const tokenPayload = await this.authService.verifyToken(token);

    return this.authService.validateUser(tokenPayload.id);
  }
}
