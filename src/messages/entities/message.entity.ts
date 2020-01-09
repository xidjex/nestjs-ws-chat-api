import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';

// Entities
import { User } from '../../users/entities/user.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: 'datetime' })
  date: string;

  @ManyToOne(() => User, user => user.messages)
  user: User;
}
