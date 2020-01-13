import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

// Entities
import { UserStatus } from '../../users/entities/user.entity';

// Exceptions
import { UserMutedException } from '../../auth/exceptions/user-muted.exception';
import { UserBannedException } from '../../auth/exceptions/user-banned.exception';
import { MessageFrequencyException } from '../../auth/exceptions/message-frequency.exception';

// Services
import { UsersOnlineService } from '../users-online.service';

const messagesFrequencyLimit = 30; // Seconds Todo: Move it in .env

@Injectable()
export class MessagesGuard implements CanActivate {
  private readonly statuses: UserStatus[] = [UserStatus.muted, UserStatus.banned];

  constructor(private readonly usersOnlineService: UsersOnlineService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();

    const user = client.handshake.query.user || {};

    // Check messages sending frequency
    const { lastMessageTime } = this.usersOnlineService.get(user.id);
    const currentTime = new Date();

    const isPassTime = !lastMessageTime
      || ((currentTime.getTime() - lastMessageTime.getTime())) / 100 > messagesFrequencyLimit;

    if (!isPassTime) {
      throw new MessageFrequencyException('Exceeded frequency sending of a messages');
    }

    // Check user status
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
