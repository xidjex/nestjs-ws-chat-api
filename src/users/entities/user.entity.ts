import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum UserStatus {
  active,
  banned,
  muted,
}

@Entity()
@Unique(['email', 'name'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
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
