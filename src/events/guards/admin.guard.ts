import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ForbiddenException } from '../../common/exceptions/forbidden.exception';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();

    const user = client.handshake.query.user || {};

    if (!user.isAdmin) {
      throw new ForbiddenException('This action allowed only for an admin users.');
    }

    return true;
  }
}
