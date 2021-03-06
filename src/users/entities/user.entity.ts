import { Entity, Column, PrimaryGeneratedColumn, Unique, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

// Entities
import { Message } from '../../messages/entities/message.entity';

export enum UserStatus {
  active,
  banned,
  muted,
}

@Entity()
@Unique(['email', 'name'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  name: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.active,
  })
  status: UserStatus;

  @Column({ select: false, default: null })
  refreshToken: string;

  @OneToMany(() => Message, message => message.user)
  messages: Message[];
}
