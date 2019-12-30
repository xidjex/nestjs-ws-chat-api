import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

// Services
import { AuthService } from './auth.service';

// Dto
import { UserRegisterDto } from '../users/dto/user.register.dto';
import { UserLoginDto } from '../users/dto/user.login.dto';

// Entities
import { User } from 'src/users/entities/user.entity';

// Types
import { AccessTokenType } from './types/access-token.type';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: UserLoginDto): Promise<AccessTokenType> {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: UserRegisterDto): Promise<User> {
    return await this.authService.register(user) as User;
  }
}
