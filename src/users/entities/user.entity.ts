import { Entity, Column, PrimaryGeneratedColumn, Unique, BaseEntity } from 'typeorm';
import { Exclude } from 'class-transformer';

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

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
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
}
