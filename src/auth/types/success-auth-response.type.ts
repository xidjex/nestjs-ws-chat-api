import { User } from '../../users/entities/user.entity';

export interface SuccessAuthResponseType {
  accessToken: string;
  refreshToken: string;
  user: User;
}
