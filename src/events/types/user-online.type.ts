import { Socket } from 'socket.io';

// Entities
import { User } from '../../users/entities/user.entity';

export class UserOnline {
  socket: Socket;
  user: User;
  lastMessageTime?: Date;
}
