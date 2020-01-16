import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { MessagesModule } from './messages/messages.module';

// Configs
import configService from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configService] }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    EventsModule,
    MessagesModule,
  ],
})
export class AppModule {}
