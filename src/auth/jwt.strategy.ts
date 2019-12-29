import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { constants } from './constants';

import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { TokenPayloadInterface } from './interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.secret,
    });
  }

  async validate(payload: TokenPayloadInterface): Promise<User | null> {
    const { id } = payload;

    return await this.authService.validateUser(id);
  }
}
