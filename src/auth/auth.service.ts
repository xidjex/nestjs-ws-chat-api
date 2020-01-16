import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Services
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';

// Entities
import { User, UserStatus } from '../users/entities/user.entity';

// Dto
import { UserLoginDto } from '../users/dto/user.login.dto';
import { UserRegisterDto } from '../users/dto/user.register.dto';

// Types
import { AccessTokenType } from './types/access-token.type';
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

  async login(userDto: UserLoginDto): Promise<AccessTokenType> {
    const { email, password } = userDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User with provided email doesn\'t exist.');
    }

    const isCorrectPassword = await this.passwordService.compare(password, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Provided credentials are incorrect.');
    }

    const { password: pass, ...payload } = user;

    const expiresIn = this.configService.get<string>('accessTokenLifetime');

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn }),
    };
  }

  async register(userDto: UserRegisterDto): Promise<{ user: User, accessToken: string }> {
    const { email, name, password } = userDto;

    const hashedPassword = await this.passwordService.hash(password);

    const expiresIn = this.configService.get<string>('accessTokenLifetime');

    const user = await this.usersService.create({
      email,
      name,
      password: hashedPassword,
    });

    delete user.password;

    const { ...payload } = user;

    return {
      user,
      accessToken: this.jwtService.sign(payload, { expiresIn }),
    };
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
}
