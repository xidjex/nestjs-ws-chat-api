import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

// Entity
import { User } from '../users/entities/user.entity';

// Types
import { UserOnline } from './types/user-online.type';

@Injectable()
export class UsersOnlineService {
  private users: UserOnline[] = [];

  add(user: User, socket: Socket): UsersOnlineService {
    const isExists = this.users.some(({ user: userConnected, socket: socketConnected }) => {
      return user.id === userConnected.id || socket.id === socketConnected.id;
    });

    if (!isExists) {
      this.users.push({ socket, user });
    }

    return this;
  }

  delete(target: User | Socket): UsersOnlineService {
    const key = target instanceof User ? 'user' : 'socket';

    this.users = this.users.filter(({ [key]: { id } }) => id !== target.id);

    return this;
  }

  update(user: User, socket?: Socket, lastMessageTime?: Date): UsersOnlineService {
    this.users = this.users.map((userOnline) => {
      if (userOnline.user.id === user.id) {
        return {
          ...userOnline,
          user,
          ...(socket && { socket }),
          ...(lastMessageTime && { lastMessageTime }),
        };
      }

      return userOnline;
    });

    return this;
  }

  get(userId: number): UserOnline | undefined {
    return this.users.find(({ user: { id } }) => id === userId);
  }

  toArray(): User[] {
    return this.users.map(({ user }) => user);
  }
}
