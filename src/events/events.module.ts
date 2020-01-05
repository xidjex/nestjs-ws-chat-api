import { Module } from '@nestjs/common';
import { EventsGateway } from './events.getway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UsersOnlineService } from './users-online.service';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [AuthModule, UsersModule, MessagesModule],
  providers: [EventsGateway, UsersOnlineService],
})
export class EventsModule {}
