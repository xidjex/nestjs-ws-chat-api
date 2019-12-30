import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
  WsResponse,
  WsException,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';

import { AuthJwtWsGuard } from 'src/auth/auth.jwt-ws.guard';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JsonWebTokenError } from 'jsonwebtoken';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  private users: Map<number, User> = new Map();

  @UseGuards(AuthJwtWsGuard)
  afterInit(server: Server) {
    server.use(async (socket: Socket, next) => { // Validate jwt token
      try {
        const token: string = socket.handshake.query.token;

        await this.authService.verifyToken(token);

        return next();
      } catch (exception) {
        return next(new WsException(`Token invalid: ${exception.message}`));
      }
    });
  }

  @UseGuards(AuthJwtWsGuard)
  async handleConnection(socket: Socket) {
    try {
      const user = await this.getUser(socket);

      this.users.set(user.id, user);

      socket.emit('users', Array.from(this.users.values()));

    } catch (exception) {
      if (exception instanceof JsonWebTokenError) {
        return new WsException(`Token invalid: ${exception.message}`);
      }

      throw exception;
    }
  }

  @UseGuards(AuthJwtWsGuard)
  async handleDisconnect(socket: Socket) {
    try {
      const user = await this.getUser(socket);

      this.users.delete(user.id);

      socket.emit('users', Array.from(this.users.values()));

    } catch (exception) {
      if (exception instanceof JsonWebTokenError) {
        return new WsException(`Token invalid: ${exception.message}`);
      }

      throw exception;
    }
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    const event = 'events';
    return { event, data };
  }

  getUser(socket: Socket): Promise<User> {
    const token: string = socket.handshake.query.token;

    const { id } = this.authService.decodeToken(token);

    return this.userService.findById(id);
  }
}
