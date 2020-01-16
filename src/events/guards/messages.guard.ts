import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';

// Entities
import { UserStatus } from '../../users/entities/user.entity';

// Exceptions
import { UserMutedException } from '../../common/exceptions/user-muted.exception';
import { UserBannedException } from '../../common/exceptions/user-banned.exception';
import { MessageFrequencyException } from '../../common/exceptions/message-frequency.exception';

// Services
import { UsersOnlineService } from '../users-online.service';

@Injectable()
export class MessagesGuard implements CanActivate {
  private readonly statuses: UserStatus[] = [UserStatus.muted, UserStatus.banned];

  constructor(
    private readonly usersOnlineService: UsersOnlineService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();

    const user = client.handshake.query.user || {};

    // Check messages sending frequency
    const { lastMessageTime } = this.usersOnlineService.get(user.id);
    const messagesFrequencyLimit = this.configService.get<number>('messagesFrequencyLimit');

    const isPassTime = !lastMessageTime
      || ((new Date().getTime() - lastMessageTime.getTime())) / 100 > messagesFrequencyLimit;

    if (!isPassTime) {
      throw new MessageFrequencyException('Exceeded messages frequency sends');
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
