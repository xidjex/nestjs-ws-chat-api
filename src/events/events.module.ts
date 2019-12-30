import { Module } from '@nestjs/common';
import { EventsGateway } from './events.getway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [EventsGateway],
})
export class EventsModule {}
