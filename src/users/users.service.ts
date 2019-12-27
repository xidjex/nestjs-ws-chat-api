import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserStatus } from '../entities/user.entity';
import { UserRegisterDto } from '../dto/user.register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  find(email: string, password: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email, password },
    });
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  async updateStatus(id: number, status: UserStatus): Promise<User> {
    const user = await this.userRepository.findOneOrFail(id);

    user.status = status;

    return this.userRepository.save(user);
  }

  create(user: UserRegisterDto) {
    return this.userRepository.save(user);
  }
}
