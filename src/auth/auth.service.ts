import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { UserLoginDto } from '../dto/user.login.dto';
import { UserRegisterDto } from '../dto/user.register.dto';
import { PasswordService } from './password.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.find(email, pass);

    if (user.password === pass) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(userDto: UserLoginDto) {
    const { email, password } = userDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User with provided email doesn\'t exist');
    }

    const isCorrectPassword = await this.passwordService.compare(password, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Provided credentials are incorrect.');
    }

    const { password: pass, ...payload } = user;

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(userDto: UserRegisterDto): Promise<User> {
    const { password, ...restData } = userDto;
    const hashedPassword: string = await this.passwordService.hash(password);

    const user = await this.usersService.create({
      password: hashedPassword,
      ...restData,
    });

    return user;
  }
}
