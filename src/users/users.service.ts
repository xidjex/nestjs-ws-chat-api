import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

// Entities
import { User, UserStatus } from './entities/user.entity';

// Exceptions
import { UserAlreadyExistException } from './exceptions/user.already-exist.exception';

// Dto
import { UserRegisterDto } from './dto/user.register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'name',
        'password',
        'isAdmin',
        'status',
      ],
    });
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  findByRefreshToken(refreshToken: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { refreshToken },
    });
  }

  async updateStatus(id: number, status: UserStatus): Promise<User> {
    const user = await this.userRepository.findOneOrFail(id);

    user.status = status;

    return this.userRepository.save(user);
  }

  async create(user: UserRegisterDto): Promise<User> {
    try {
      return await this.userRepository.create(user).save();
    } catch (exception) {
      if (exception instanceof QueryFailedError) {
        throw new UserAlreadyExistException('User with provided email or name already exist');
      } else {
        throw exception;
      }
    }
  }
}
