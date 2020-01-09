import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { Message } from './entities/message.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async getList(limit: number = 10): Promise<Message[]> {
    const messages = await this.messagesRepository.find({
      take: limit,
      order: { date: 'DESC' },
      join: {
        alias: 'message',
        leftJoinAndSelect: {
          user: 'message.user',
        },
      },
    });

    return messages.sort(({ date: d1 }, { date: d2 }) => {
      return +new Date(d1) - +new Date(d2);
    });
  }

  create(message: string, user: User): Promise<Message> {
    return this.messagesRepository.create({
        text: message,
        date: new Date().toLocaleString(),
        user,
    }).save();
  }
}
