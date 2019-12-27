import {
  Controller,
  Get,
  Body,
  Post,
  Param,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';

@Controller('users')
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
