import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// Services
import { AuthService } from './auth.service';

// Entities
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthJwtWsGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  // Attach user data to connection
  attachUser(context: ExecutionContext, user: User): void {
    const client = context.switchToWs().getClient();

    client.handshake.query.user = user;
  }

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const { token = '' } = client.handshake.query;

    const tokenPayload = await this.authService.verifyToken(token);

    const user = await this.authService.validateUser(tokenPayload.id);

    this.attachUser(context, user);

    return !!tokenPayload;
  }
}
