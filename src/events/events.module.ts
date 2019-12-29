import { Module } from '@nestjs/common';
import { EventsGateway } from './events.getway';

@Module({
  providers: [EventsGateway],
})
export class EventsModule {}
