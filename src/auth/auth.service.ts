import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { JsonWebTokenError, verify, sign } from 'jsonwebtoken';

// Services
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';

// Entities
import { User, UserStatus } from '../users/entities/user.entity';

// Dto
import { UserLoginDto } from '../users/dto/user.login.dto';
import { UserRegisterDto } from '../users/dto/user.register.dto';

// Types
import { SuccessAuthResponseType } from './types/success-auth-response.type';
import { TokenPayloadType } from './types/token-payload.type';

// Exceptions
import { InvalidTokenException } from '../common/exceptions/invalid-token.exception';
import { UserBannedException } from '../common/exceptions/user-banned.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async login(userDto: UserLoginDto): Promise<SuccessAuthResponseType> {
    const { email, password } = userDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User with provided email doesn\'t exist.');
    }

    const isCorrectPassword = await this.passwordService.compare(password, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Provided credentials are incorrect.');
    }

    if (user.status === UserStatus.banned) {
      throw new UserBannedException('Forbidden. You banned by admin!');
    }

    return this.generateTokens(user);
  }

  async register(userDto: UserRegisterDto): Promise<{ user: User, accessToken: string }> {
    const { email, name, password } = userDto;

    const hashedPassword = await this.passwordService.hash(password);

    const user = await this.usersService.create({
      email,
      name,
      password: hashedPassword,
    });

    delete user.password;

    return this.generateTokens(user);
  }

  async logout(user: User): Promise<void> {
    user.refreshToken = null;

    await user.save();
  }

  async validateUser(id: number): Promise<User | null> {
    const user = await this.usersService.findById(id);

    if (user && user.status === UserStatus.banned) {
      throw new UserBannedException('Forbidden. You banned by admin!');
    }

    return user;
  }

  async verifyToken(token: string): Promise<TokenPayloadType> {
    if (!token) {
      throw new InvalidTokenException('Bearer token doesn\'t present');
    }

    try {
      const formattedToken = token.replace('Bearer ', '');

      return this.jwtService.verifyAsync<TokenPayloadType>(formattedToken);
    } catch (exception) {
      throw new InvalidTokenException(`Token invalid: ${exception.message}`);
    }
  }

  async refreshTokens(refreshToken: string): Promise<SuccessAuthResponseType> {
    const refreshTokenSecret = this.configService.get<string>('refreshTokenSecret');

    try {
      verify(refreshToken, refreshTokenSecret);

      const user: User = await this.usersService.findByRefreshToken(refreshToken);

      return this.generateTokens(user);
    } catch (exception) {
      if (exception instanceof EntityNotFoundError) {
        throw new InvalidTokenException('Refresh token invalid: Token in the blacklist');
      }

      if (exception instanceof JsonWebTokenError) {
        throw new InvalidTokenException(`Refresh token invalid: ${exception.message}`);
      }

      throw exception;
    }
  }

  protected async generateTokens(user: User): Promise<SuccessAuthResponseType> {
    const { password: pass, refreshToken: token, ...payload } = user;

    delete user.password;
    delete user.refreshToken;

    const accessTokenLifetime = this.configService.get<string>('accessTokenLifetime');
    const refreshTokenLifetime = this.configService.get<string>('refreshTokenLifetime');
    const refreshTokenSecret = this.configService.get<string>('refreshTokenSecret');

    const refreshToken = sign({
      data: user.id,
    }, refreshTokenSecret, { expiresIn: refreshTokenLifetime });

    user.refreshToken = refreshToken;

    await user.save();

    delete user.refreshToken;

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: accessTokenLifetime }),
      refreshToken,
      user,
    };
  }
}
