import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UsersOnlineService {
  private users: Map<number, User> = new Map();

  add(user: User): UsersOnlineService {
    this.users.set(user.id, user);

    return this;
  }

  delete(id: number): UsersOnlineService {
    this.users.delete(id);

    return this;
  }

  update(user: User): UsersOnlineService {
    this.users.set(user.id, user);

    return this;
  }

  get(id: number): User | undefined {
    return this.users.get(id);
  }

  toArray(): User[] {
    return Array.from(this.users.values());
  }
}
