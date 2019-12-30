import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// Constants
import { constants } from './constants';

import { verify } from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';
import { TokenPayloadType } from './types/token-payload.type';
import { AuthService } from './auth.service';

@Injectable()
export class AuthJwtWsGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  retrieveBearerToken(context: ExecutionContext): string {
    const client = context.switchToWs().getClient();

    return client.handshake.query.token;
  }
  canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const token: string = this.retrieveBearerToken(context);

      return this.authService.verifyToken(token);
    } catch (exception) {
      throw new WsException(`Token invalid: ${exception.message}`);
    }
  }
}
