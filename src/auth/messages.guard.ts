import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserStatus } from '../users/entities/user.entity';
import { WsException } from '@nestjs/websockets';

import { UserMutedException } from './exceptions/user-muted.exception';
import { UserBannedException } from './exceptions/user-banned.exception';

@Injectable()
export class MessagesGuard implements CanActivate {
  constructor(readonly statuses: UserStatus[] = [UserStatus.muted, UserStatus.banned]) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const client = context.switchToWs().getClient();

    const user = client.handshake.query.user;

    if (this.statuses.includes(user.status)) {
      switch (user.status) {
        case UserStatus.muted:
          throw new UserMutedException('Forbidden. You not allowed to send a messages!');
        case UserStatus.banned:
          throw new UserBannedException('Forbidden. You banned by admin!');
        default: throw new WsException('Something wrong with your status!');
      }
    }

    return true;
  }
}
