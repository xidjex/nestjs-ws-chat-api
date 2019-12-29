import { UserStatus } from '../../users/entities/user.entity';

export interface TokenPayloadInterface {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  status: UserStatus;
}
