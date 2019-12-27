import { Controller, Body, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserRegisterDto } from '../users/dto/user.register.dto';
import { UserLoginDto } from '../users/dto/user.login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: UserLoginDto) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: UserRegisterDto) {
    return this.authService.register(user);
  }
}
