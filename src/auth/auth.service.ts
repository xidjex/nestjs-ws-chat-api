import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Services
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';

// Entities
import { User } from '../users/entities/user.entity';

// Dto
import { UserLoginDto } from '../users/dto/user.login.dto';
import { UserRegisterDto } from '../users/dto/user.register.dto';

// Interfaces
import { AccessTokenInterface } from './interfaces/access-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(id: number): Promise<any> {
    return await this.usersService.findById(id);
  }

  async login(userDto: UserLoginDto): Promise<AccessTokenInterface> {
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

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(userDto: UserRegisterDto): Promise<User> {
    const { email, name, password } = userDto;

    const hashedPassword: string = await this.passwordService.hash(password);

    return await this.usersService.create({
      email,
      name,
      password: hashedPassword,
    });
  }
}
