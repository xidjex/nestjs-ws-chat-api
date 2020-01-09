import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../users/entities/user.entity';

export class UserStatusChangeDto {
  @IsNotEmpty()
  id: number;

  @IsEnum(UserStatus)
  status: UserStatus;
}
