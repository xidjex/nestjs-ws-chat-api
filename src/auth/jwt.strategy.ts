import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { constants } from './constants';

import { TokenPayloadType } from './types/token-payload.type';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.secret,
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
