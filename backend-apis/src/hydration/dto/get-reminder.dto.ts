import { IsObject, IsOptional } from 'class-validator';
import { Reminder } from '../entities/reminder.entity';

export class GetRemindersDto {
  @IsObject()
  @IsOptional()
  match?: Reminder;
}
