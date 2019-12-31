import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { constants } from './constants';

import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { TokenPayloadType } from './types/token-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.secret,
    });
  }

  validate(payload: TokenPayloadType): boolean {
    const { id, email, name } = payload;

    return Boolean(id && email && name);
  }
}
