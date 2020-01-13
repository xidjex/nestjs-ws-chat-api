import { Length } from 'class-validator';

export class MessageDto {
  @Length(5, 160)
  text: string;
}
