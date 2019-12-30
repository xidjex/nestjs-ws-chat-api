import { UserStatus } from '../../users/entities/user.entity';

export class TokenPayloadType {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  status: UserStatus;
}
