import {
  OnGatewayInit,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  users: any = [];

  afterInit(server: Server) {
    server.use((socket, next) => {
      const token = socket.handshake.query.token;

      if (!token) {
        return next(new Error('authentication error'));
      }

      return next();
    });
  }

  async handleConnection(socket) {

  const token = socket.handshake.query.token;

    console.log(token);
  }
}
