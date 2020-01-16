import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Modules
import { UsersModule } from '../users/users.module';

// Services
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';

// Controllers
import { AuthController } from './auth.controller';

// Strategies
import { JwtStrategy } from './jwt.strategy';

// Configs
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('accessTokenSecret'),
        signOptions: { expiresIn: config.get('accessTokenLifetime') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    PasswordService,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    PassportModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
