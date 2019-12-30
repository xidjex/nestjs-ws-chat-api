import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';

// Services
import { UsersService } from './users.service';

// Entities
import { User } from 'src/users/entities/user.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post(':id')
  updateStatus(@Param('id') id, @Body('status') status): Promise<User> {
    return this.usersService.updateStatus(id, status);
  }
}
