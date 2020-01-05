import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UsersOnlineService {
  private users: Map<string, User> = new Map();

  add(socketId: string, user: User): UsersOnlineService {
    this.users.set(socketId, user);

    return this;
  }

  delete(socketId: string): UsersOnlineService {
    this.users.delete(socketId);

    return this;
  }

  update(socketId: string, user: User): UsersOnlineService {
    this.users.set(socketId, user);

    return this;
  }

  get(socketId: string): User | undefined {
    return this.users.get(socketId);
  }

  toArray(): User[] {
    return Array.from(this.users.values());
  }
}
