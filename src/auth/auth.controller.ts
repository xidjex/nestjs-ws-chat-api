import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  Request,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';

// Services
import { AuthService } from './auth.service';

// Dto
import { UserRegisterDto } from '../users/dto/user.register.dto';
import { UserLoginDto } from '../users/dto/user.login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Entities
import { User } from 'src/users/entities/user.entity';

// Types
import { SuccessAuthResponseType } from './types/success-auth-response.type';

// Guards
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: UserLoginDto): Promise<SuccessAuthResponseType> {
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() user: UserRegisterDto): Promise<{ user: User, accessToken: string }> {
    return this.authService.register(user);
  }

  @UseGuards(AuthGuard())
  @Post('/check_token')
  checkToken(): boolean { return; }

  @Post('/refresh_token')
  refreshToken(@Body() refreshTokenData: RefreshTokenDto): Promise<SuccessAuthResponseType> {
    return this.authService.refreshTokens(refreshTokenData.refreshToken);
  }

  @UseGuards(AuthGuard())
  @Post('/logout')
  async logout(@Request() request): Promise<void> {
    await this.authService.logout(request.user);
  }
}
