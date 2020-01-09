import { Socket } from 'socket.io';
import { User } from '../../users/entities/user.entity';

export class UserOnline {
  socket: Socket;
  user: User;
}
