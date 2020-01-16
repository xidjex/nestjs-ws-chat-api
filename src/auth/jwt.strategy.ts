import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// Types
import { TokenPayloadType } from './types/token-payload.type';

// Entities
import { User } from 'src/users/entities/user.entity';

// Services
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('accessTokenSecret'),
    });
  }

  async validate(payload: TokenPayloadType): Promise<User | null> | null {
    const { id, email, name } = payload;

    if (Boolean(!id || !email || !name)) {
      return null;
    }

    return this.authService.validateUser(id);
  }
}
